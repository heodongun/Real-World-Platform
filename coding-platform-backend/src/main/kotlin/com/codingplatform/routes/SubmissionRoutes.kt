package com.codingplatform.routes

import com.codingplatform.models.SubmissionRequest
import com.codingplatform.models.SubmissionResponse
import com.codingplatform.models.SubmissionResponseData
import com.codingplatform.models.SubmissionStatus
import com.codingplatform.services.ProblemService
import com.codingplatform.services.SubmissionService
import com.codingplatform.utils.userId
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import java.util.UUID

/**
 * 제출물 처리를 위한 라우트를 구성합니다.
 * @param submissionService 제출 관련 로직을 처리하는 서비스.
 * @param problemService 문제 관련 로직을 처리하는 서비스.
 */
fun Route.configureSubmissionRoutes(
    submissionService: SubmissionService,
    problemService: ProblemService
) {
    authenticate("auth-jwt") {
        /**
         * 새 제출물을 생성하는 엔드포인트.
         * @param SubmissionRequest 문제 ID와 코드가 포함된 요청 본문.
         * @return 202 Accepted. 제출물이 처리 중임을 알리는 메시지를 포함합니다.
         */
        post("/api/submissions") {
            val userId = call.userId() ?: return@post call.respond(HttpStatusCode.Unauthorized)
            val request = call.receive<SubmissionRequest>()

            // Ensure problem exists
            if (problemService.getProblem(request.problemId) == null) {
                return@post call.respond(HttpStatusCode.BadRequest, mapOf("error" to "문제를 찾을 수 없습니다."))
            }

            val submission = submissionService.createSubmission(userId, request)
            call.respond(
                HttpStatusCode.Accepted,
                SubmissionResponse(
                    success = true,
                    data = SubmissionResponseData(
                        submissionId = submission.id,
                        status = SubmissionStatus.PENDING,
                        message = "코드 평가가 시작되었습니다."
                    )
                )
            )
        }

        /**
         * 현재 사용자의 모든 제출물을 나열하는 엔드포인트.
         * @return 200 OK. 제출물 목록을 포함합니다.
         */
        get("/api/submissions") {
            val userId = call.userId() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val submissions = submissionService.listSubmissions(userId)
            call.respond(submissions)
        }

        /**
         * ID로 특정 제출물을 가져오는 엔드포인트.
         * @param id 제출물의 ID.
         * @return 200 OK. 제출물 세부 정보를 포함하며, 제출물이 없으면 404 Not Found, 현재 사용자에게 속하지 않으면 403 Forbidden을 반환합니다.
         */
        get("/api/submissions/{id}") {
            val userId = call.userId() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val idParam = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val submissionId = runCatching { UUID.fromString(idParam) }.getOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest)
            val submission = submissionService.getSubmission(submissionId)
                ?: return@get call.respond(HttpStatusCode.NotFound)
            if (submission.userId != userId) {
                return@get call.respond(HttpStatusCode.Forbidden)
            }
            call.respond(submission)
        }
    }
}
