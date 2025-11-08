package com.codingplatform.routes

import com.codingplatform.models.AuthResponse
import com.codingplatform.models.LoginRequest
import com.codingplatform.models.RegisterRequest
import com.codingplatform.models.UserRole
import com.codingplatform.services.AuthService
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post

fun Route.configureAuthRoutes(
    authService: AuthService
) {
    post("/api/auth/register") {
        val request = call.receive<RegisterRequest>()
        val (user, token) = authService.register(
            email = request.email,
            password = request.password,
            name = request.name,
            role = UserRole.USER
        )
        call.respond(HttpStatusCode.Created, AuthResponse(token = token, user = user))
    }

    post("/api/auth/login") {
        val request = call.receive<LoginRequest>()
        val (user, token) = authService.login(request.email, request.password)
        call.respond(AuthResponse(token = token, user = user))
    }
}
