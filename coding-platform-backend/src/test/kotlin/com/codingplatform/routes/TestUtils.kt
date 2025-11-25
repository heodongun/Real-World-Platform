package com.codingplatform.routes

import com.codingplatform.plugins.configureRouting
import com.codingplatform.plugins.configureSerialization
import com.codingplatform.services.AuthService
import com.codingplatform.services.EmailVerificationService
import com.codingplatform.services.ProblemService
import io.ktor.server.application.Application

fun Application.setupTestApplication(
    authService: AuthService,
    emailVerificationService: EmailVerificationService,
    problemService: ProblemService
) {
    configureRouting()
    configureSerialization()
    configureAuthRoutes(authService, emailVerificationService)
    configureProblemRoutes(problemService)
}