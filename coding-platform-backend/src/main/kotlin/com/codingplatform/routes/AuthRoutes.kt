package com.codingplatform.routes

import com.codingplatform.models.AuthResponse
import com.codingplatform.models.LoginRequest
import com.codingplatform.models.RegisterRequest
import com.codingplatform.models.UserRole
import com.codingplatform.models.VerificationCodeRequest
import com.codingplatform.services.AuthService
import com.codingplatform.services.EmailVerificationService
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post

/**
 * Defines authentication-related routes.
 * @param authService The service for handling authentication logic.
 * @param emailVerificationService The service for handling email verification.
 */
fun Route.configureAuthRoutes(
    authService: AuthService,
    emailVerificationService: EmailVerificationService
) {
    /**
     * Endpoint for requesting a verification code for registration.
     * @param VerificationCodeRequest The request body containing the user's email.
     * @return 202 Accepted with a message indicating the code has been sent.
     */
    post("/api/auth/register/code") {
        val request = call.receive<VerificationCodeRequest>()
        authService.requestVerificationCode(request.email)
        call.respond(HttpStatusCode.Accepted, mapOf("message" to "인증 코드가 발송되었습니다."))
    }

    /**
     * Endpoint for user registration.
     * @param RegisterRequest The request body containing registration details (email, password, name, verification code).
     * @return 201 Created with an AuthResponse containing the user and a JWT token.
     */
    post("/api/auth/register") {
        val request = call.receive<RegisterRequest>()
        val (user, token) = authService.register(
            email = request.email,
            password = request.password,
            name = request.name,
            verificationCode = request.verificationCode,
            role = UserRole.USER
        )
        call.respond(HttpStatusCode.Created, AuthResponse(token = token, user = user))
    }

    /**
     * Endpoint for user login.
     * @param LoginRequest The request body containing user credentials (email, password).
     * @return 200 OK with an AuthResponse containing the user and a JWT token.
     */
    post("/api/auth/login") {
        val request = call.receive<LoginRequest>()
        val (user, token) = authService.login(request.email, request.password)
        call.respond(AuthResponse(token = token, user = user))
    }
}
