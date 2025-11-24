package com.codingplatform.routes

import com.codingplatform.models.ExecuteCodeRequest
import com.codingplatform.models.ExecutionResponse
import com.codingplatform.services.DockerExecutorService
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post

/**
 * 코드 실행을 위한 라우트를 정의합니다.
 * @param dockerExecutorService Docker 컨테이너에서 코드를 실행하는 서비스.
 */
fun Route.configureExecutionRoutes(dockerExecutorService: DockerExecutorService) {
    authenticate("auth-jwt") {
        /**
         * 코드 실행을 위한 엔드포인트.
         * @param ExecuteCodeRequest 언어, 파일, 테스트 명령어가 포함된 요청 본문.
         * @return 200 OK. 실행 결과가 포함된 ExecutionResponse를 반환합니다.
         */
        post("/api/execute") {
            val request = call.receive<ExecuteCodeRequest>()
            val result = dockerExecutorService.executeCode(
                language = request.language,
                files = request.files,
                command = request.testCommand
            )
            call.respond(ExecutionResponse(success = result.status == com.codingplatform.models.ExecutionStatus.SUCCESS, data = result))
        }
    }
}
