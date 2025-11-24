package com.codingplatform.routes

import com.codingplatform.models.UpdateProfileRequest
import com.codingplatform.services.UserService
import com.codingplatform.utils.userId
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put

/**
 * Configures routes related to user management.
 * @param userService The service for handling user-related logic.
 */
fun Route.configureUserRoutes(userService: UserService) {
    authenticate("auth-jwt") {
        /**
         * Endpoint to get the current user's profile.
         * @return 200 OK with the user's profile, or 404 Not Found if the user doesn't exist.
         */
        get("/api/users/me") {
            val userId = call.userId() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val user = userService.getUser(userId)
                ?: return@get call.respond(HttpStatusCode.NotFound)
            call.respond(user)
        }

        /**
         * Endpoint to update the current user's profile.
         * @param UpdateProfileRequest The request body containing the updated name.
         * @return 200 OK with the updated user's profile, or 404 Not Found if the user doesn't exist.
         */
        put("/api/users/me") {
            val userId = call.userId() ?: return@put call.respond(HttpStatusCode.Unauthorized)
            val request = call.receive<UpdateProfileRequest>()
            val updated = userService.updateProfile(userId, request.name)
                ?: return@put call.respond(HttpStatusCode.NotFound)
            call.respond(updated)
        }
    }
}
