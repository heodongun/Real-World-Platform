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
 * 인증 관련 라우트를 정의합니다.
 * @param authService 인증 로직을 처리하는 서비스.
 * @param emailVerificationService 이메일 인증을 처리하는 서비스.
 */
fun Route.configureAuthRoutes(
    authService: AuthService,
    emailVerificationService: EmailVerificationService
) {
    /**
     * 회원가입을 위한 인증 코드를 요청하는 엔드포인트.
     * @param VerificationCodeRequest 사용자의 이메일이 포함된 요청 본문.
     * @return 202 Accepted. 코드가 발송되었음을 알리는 메시지를 포함합니다.
     */
    post("/api/auth/register/code") {
        val request = call.receive<VerificationCodeRequest>()
        authService.requestVerificationCode(request.email)
        call.respond(HttpStatusCode.Accepted, mapOf("message" to "인증 코드가 발송되었습니다."))
    }

    /**
     * 사용자 회원가입을 위한 엔드포인트.
     * @param RegisterRequest 회원가입 정보(이메일, 비밀번호, 이름, 인증 코드)가 포함된 요청 본문.
     * @return 201 Created. 사용자와 JWT 토큰이 포함된 AuthResponse를 반환합니다.
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
     * 사용자 로그인을 위한 엔드포인트.
     * @param LoginRequest 사용자 자격 증명(이메일, 비밀번호)이 포함된 요청 본문.
     * @return 200 OK. 사용자와 JWT 토큰이 포함된 AuthResponse를 반환합니다.
     */
    post("/api/auth/login") {
        val request = call.receive<LoginRequest>()
        val (user, token) = authService.login(request.email, request.password)
        call.respond(AuthResponse(token = token, user = user))
    }
}
