package com.codingplatform.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.codingplatform.models.CreateProblemRequest
import com.codingplatform.models.Problem
import com.codingplatform.models.UpdateProblemRequest
import com.codingplatform.models.UserRole
import com.codingplatform.services.AuthService
import com.codingplatform.services.EmailVerificationService
import com.codingplatform.services.ProblemService
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.put
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
import java.util.Date
import java.util.UUID

class ProblemRoutesTest {
    private val authService: AuthService = mockk()
    private val emailVerificationService: EmailVerificationService = mockk()
    private val problemService: ProblemService = mockk()
    private val adminToken = generateTestToken(UUID.randomUUID(), UserRole.ADMIN)
    private val userToken = generateTestToken(UUID.randomUUID(), UserRole.USER)

    @Test
    fun `GET to problems should return a list of problems`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problems = listOf(
            Problem(UUID.randomUUID(), "Problem 1", "problem-1", "Description 1", "Easy", "Kotlin", "{}", "fun main() {}"),
            Problem(UUID.randomUUID(), "Problem 2", "problem-2", "Description 2", "Medium", "Python", "{}", "def main():")
        )

        coEvery { problemService.listProblems() } returns problems

        val response = client.get("/api/problems")

        assertEquals(HttpStatusCode.OK, response.status)
        val responseBody = response.bodyAsText()
        val problemResponses = Json.decodeFromString<List<Problem>>(responseBody)
        assertEquals(2, problemResponses.size)
    }

    @Test
    fun `GET to problems by ID should return a problem`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problemId = UUID.randomUUID()
        val problem = Problem(problemId, "Problem 1", "problem-1", "Description 1", "Easy", "Kotlin", "{}", "fun main() {}")

        coEvery { problemService.getProblem(problemId) } returns problem

        val response = client.get("/api/problems/$problemId")

        assertEquals(HttpStatusCode.OK, response.status)
        val responseBody = response.bodyAsText()
        val problemResponse = Json.decodeFromString<Problem>(responseBody)
        assertEquals(problem.id, problemResponse.id)
    }

    @Test
    fun `POST to problems should create a new problem with admin role`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = CreateProblemRequest("New Problem", "new-problem", "New Description", "Hard", "Java", "{}", "public class Main {}")
        val problem = Problem(UUID.randomUUID(), "New Problem", "new-problem", "New Description", "Hard", "Java", "{}", "public class Main {}")

        coEvery { problemService.createProblem(request) } returns problem

        val response = client.post("/api/problems") {
            header("Authorization", "Bearer $adminToken")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Created, response.status)
    }

    @Test
    fun `PUT to problems should update a problem with admin role`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problemId = UUID.randomUUID()
        val request = UpdateProblemRequest(title = "Updated Problem")
        val problem = Problem(problemId, "Updated Problem", "problem-1", "Description 1", "Easy", "Kotlin", "{}", "fun main() {}")

        coEvery { problemService.updateProblem(problemId, request) } returns problem

        val response = client.put("/api/problems/$problemId") {
            header("Authorization", "Bearer $adminToken")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `DELETE to problems should delete a problem with admin role`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problemId = UUID.randomUUID()

        coEvery { problemService.deleteProblem(problemId) } returns true

        val response = client.delete("/api/problems/$problemId") {
            header("Authorization", "Bearer $adminToken")
        }

        assertEquals(HttpStatusCode.NoContent, response.status)
    }

    @Test
    fun `POST to problems should be forbidden for non-admin users`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val request = CreateProblemRequest("New Problem", "new-problem", "New Description", "Hard", "Java", "{}", "public class Main {}")

        val response = client.post("/api/problems") {
            header("Authorization", "Bearer $userToken")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    @Test
    fun `PUT to problems should be forbidden for non-admin users`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problemId = UUID.randomUUID()
        val request = UpdateProblemRequest(title = "Updated Problem")

        val response = client.put("/api/problems/$problemId") {
            header("Authorization", "Bearer $userToken")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    @Test
    fun `DELETE to problems should be forbidden for non-admin users`() = testApplication {
        application {
            setupTestApplication(authService, emailVerificationService, problemService)
        }

        val problemId = UUID.randomUUID()

        val response = client.delete("/api/problems/$problemId") {
            header("Authorization", "Bearer $userToken")
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    private fun generateTestToken(userId: UUID, role: UserRole): String {
        return JWT.create()
            .withAudience("test-audience")
            .withIssuer("test-issuer")
            .withClaim("userId", userId.toString())
            .withClaim("role", role.name)
            .withExpiresAt(Date(System.currentTimeMillis() + 60000))
            .sign(Algorithm.HMAC256("test-secret"))
    }
}