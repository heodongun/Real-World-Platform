package com.codingplatform.routes

import com.codingplatform.models.AuthResponse
import com.codingplatform.models.LoginRequest
import com.codingplatform.models.RegisterRequest
import com.codingplatform.models.User
import com.codingplatform.models.UserRole
import com.codingplatform.models.VerificationCodeRequest
import com.codingplatform.services.AuthService
import com.codingplatform.services.EmailVerificationService
import com.codingplatform.services.ProblemService
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.UUID

class AuthRoutesTest {
    private val authService: AuthService = mockk()
    private val emailVerificationService: EmailVerificationService = mockk()
    private val problemService: ProblemService = mockk()

    @Test
    fun `POST to register should create a new user and return user and token`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = RegisterRequest("test@test.com", "password", "Test User", "123456")
        val user = User(UUID.randomUUID(), "test@test.com", "hashed_password", "Test User", UserRole.USER)
        val token = "test_token"

        coEvery { authService.register(any(), any(), any(), any(), any()) } returns Pair(user, token)

        val response = client.post("/api/auth/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val authResponse = Json.decodeFromString<AuthResponse>(response.bodyAsText())
        assertEquals(token, authResponse.token)
        assertEquals(user.copy(password = ""), authResponse.user.copy(password = ""))
    }

    @Test
    fun `POST to login should return user and token for valid credentials`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = LoginRequest("test@test.com", "password")
        val user = User(UUID.randomUUID(), "test@test.com", "hashed_password", "Test User", UserRole.USER)
        val token = "test_token"

        coEvery { authService.login(any(), any()) } returns Pair(user, token)

        val response = client.post("/api/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val authResponse = Json.decodeFromString<AuthResponse>(response.bodyAsText())
        assertEquals(token, authResponse.token)
        assertEquals(user.copy(password = ""), authResponse.user.copy(password = ""))
    }

    @Test
    fun `POST to register or code should request a verification code`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = VerificationCodeRequest("test@test.com")

        coEvery { authService.requestVerificationCode(any()) } returns Unit

        val response = client.post("/api/auth/register/code") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Accepted, response.status)
    }

    @Test
    fun `POST to login with invalid credentials should return Unauthorized`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = LoginRequest("test@test.com", "wrong_password")

        coEvery { authService.login(any(), any()) } throws Exception("Invalid credentials")

        val response = client.post("/api/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }
}