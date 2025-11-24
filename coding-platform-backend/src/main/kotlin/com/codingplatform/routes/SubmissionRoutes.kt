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
 * Configures routes for handling submissions.
 * @param submissionService The service for handling submission logic.
 * @param problemService The service for handling problem-related logic.
 */
fun Route.configureSubmissionRoutes(
    submissionService: SubmissionService,
    problemService: ProblemService
) {
    authenticate("auth-jwt") {
        /**
         * Endpoint to create a new submission.
         * @param SubmissionRequest The request body containing the problem ID and code.
         * @return 202 Accepted with a message indicating that the submission is being processed.
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
         * Endpoint to list all submissions for the current user.
         * @return 200 OK with a list of submissions.
         */
        get("/api/submissions") {
            val userId = call.userId() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val submissions = submissionService.listSubmissions(userId)
            call.respond(submissions)
        }

        /**
         * Endpoint to get a specific submission by its ID.
         * @param id The ID of the submission.
         * @return 200 OK with the submission details, or 404 Not Found if the submission doesn't exist, or 403 Forbidden if the submission does not belong to the current user.
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
