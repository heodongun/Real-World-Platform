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
 * Configures routes for managing problems.
 * @param problemService The service for handling problem-related logic.
 */
fun Route.configureProblemRoutes(problemService: ProblemService) {
    /**
     * Endpoint to list all problems.
     * @return 200 OK with a list of problems.
     */
    get("/api/problems") {
        val problems = problemService.listProblems().map { it.toResponse() }
        call.respond(problems)
    }

    /**
     * Endpoint to get a problem by its ID or slug.
     * @param id The ID or slug of the problem.
     * @return 200 OK with the problem details, or 404 Not Found if the problem doesn't exist.
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
         * Endpoint to create a new problem. Requires admin privileges.
         * @param CreateProblemRequest The request body containing the details of the new problem.
         * @return 201 Created with the created problem's details, or 403 Forbidden if the user is not an admin.
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
         * Endpoint to update an existing problem. Requires admin privileges.
         * @param id The ID of the problem to update.
         * @param UpdateProblemRequest The request body containing the updated problem details.
         * @return 200 OK with the updated problem's details, 404 Not Found if the problem doesn't exist, or 403 Forbidden if the user is not an admin.
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
         * Endpoint to delete a problem. Requires admin privileges.
         * @param id The ID of the problem to delete.
         * @return 204 No Content if the problem was deleted successfully, 404 Not Found if the problem doesn't exist, or 403 Forbidden if the user is not an admin.
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
 * Converts a Problem object to a ProblemResponse object, hiding the test files.
 * @return A ProblemResponse object.
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
