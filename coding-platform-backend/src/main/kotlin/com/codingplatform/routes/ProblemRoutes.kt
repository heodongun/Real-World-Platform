package com.codingplatform.routes

import com.codingplatform.models.CreateProblemRequest
import com.codingplatform.models.Problem
import com.codingplatform.models.ProblemResponse
import com.codingplatform.models.UpdateProblemRequest
import com.codingplatform.services.ProblemService
import com.codingplatform.utils.isAdmin
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.response.respond
import io.ktor.server.request.receive
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.delete
import java.util.UUID

/**
 * 문제 관리를 위한 라우트를 구성합니다.
 * @param problemService 문제 관련 로직을 처리하는 서비스.
 */
fun Route.configureProblemRoutes(problemService: ProblemService) {
    /**
     * 모든 문제를 나열하는 엔드포인트.
     * @return 200 OK. 문제 목록을 포함합니다.
     */
    get("/api/problems") {
        val problems = problemService.listProblems().map { it.toResponse() }
        call.respond(problems)
    }

    /**
     * ID 또는 슬러그로 문제를 가져오는 엔드포인트.
     * @param id 문제의 ID 또는 슬러그.
     * @return 200 OK. 문제 세부 정보를 포함하며, 문제가 없으면 404 Not Found를 반환합니다.
     */
    get("/api/problems/{id}") {
        val idParam = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
        val problem = runCatching { UUID.fromString(idParam) }
            .mapCatching { problemService.getProblem(it) }
            .getOrNull()
            ?: problemService.getProblemBySlug(idParam)

        if (problem == null) {
            call.respond(HttpStatusCode.NotFound)
        } else {
            call.respond(problem.toResponse())
        }
    }

    authenticate("auth-jwt") {
        /**
         * 새 문제를 생성하는 엔드포인트. 관리자 권한이 필요합니다.
         * @param CreateProblemRequest 새 문제의 세부 정보가 포함된 요청 본문.
         * @return 201 Created. 생성된 문제의 세부 정보를 포함하며, 사용자가 관리자가 아니면 403 Forbidden을 반환합니다.
         */
        post("/api/problems") {
            if (!call.isAdmin()) {
                return@post call.respond(HttpStatusCode.Forbidden, mapOf("error" to "ADMIN 권한이 필요합니다."))
            }

            val request = call.receive<CreateProblemRequest>()
            val created = problemService.createProblem(request)
            call.respond(HttpStatusCode.Created, created.toResponse())
        }

        /**
         * 기존 문제를 업데이트하는 엔드포인트. 관리자 권한이 필요합니다.
         * @param id 업데이트할 문제의 ID.
         * @param UpdateProblemRequest 업데이트된 문제 세부 정보가 포함된 요청 본문.
         * @return 200 OK. 업데이트된 문제의 세부 정보를 포함하며, 문제가 없으면 404 Not Found, 사용자가 관리자가 아니면 403 Forbidden을 반환합니다.
         */
        put("/api/problems/{id}") {
            if (!call.isAdmin()) {
                return@put call.respond(HttpStatusCode.Forbidden, mapOf("error" to "ADMIN 권한이 필요합니다."))
            }

            val idParam = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest)
            val problemId = runCatching { UUID.fromString(idParam) }.getOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest)

            val request = call.receive<UpdateProblemRequest>()
            val updated = problemService.updateProblem(problemId, request)

            if (updated == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                call.respond(updated.toResponse())
            }
        }

        /**
         * 문제를 삭제하는 엔드포인트. 관리자 권한이 필요합니다.
         * @param id 삭제할 문제의 ID.
         * @return 204 No Content. 문제가 성공적으로 삭제되면 반환되며, 문제가 없으면 404 Not Found, 사용자가 관리자가 아니면 403 Forbidden을 반환합니다.
         */
        delete("/api/problems/{id}") {
            if (!call.isAdmin()) {
                return@delete call.respond(HttpStatusCode.Forbidden, mapOf("error" to "ADMIN 권한이 필요합니다."))
            }

            val idParam = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest)
            val problemId = runCatching { UUID.fromString(idParam) }.getOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest)

            val removed = problemService.deleteProblem(problemId)

            if (removed) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}

/**
 * Problem 객체를 ProblemResponse 객체로 변환하여 테스트 파일을 숨깁니다.
 * @return ProblemResponse 객체.
 */
private fun Problem.toResponse(): ProblemResponse =
    ProblemResponse(
        id = id,
        title = title,
        slug = slug,
        description = description,
        difficulty = difficulty,
        language = language,
        tags = tags,
        starterCode = starterCode // 사용자에게 시작 코드 템플릿 제공 (테스트 파일은 숨김)
    )
