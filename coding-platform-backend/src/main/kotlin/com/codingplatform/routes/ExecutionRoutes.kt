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
 * Defines routes for code execution.
 * @param dockerExecutorService The service for executing code in a Docker container.
 */
fun Route.configureExecutionRoutes(dockerExecutorService: DockerExecutorService) {
    authenticate("auth-jwt") {
        /**
         * Endpoint for executing code.
         * @param ExecuteCodeRequest The request body containing the language, files, and test command.
         * @return 200 OK with an ExecutionResponse containing the execution result.
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
