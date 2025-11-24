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
 * 사용자 관리 관련 라우트를 구성합니다.
 * @param userService 사용자 관련 로직을 처리하는 서비스.
 */
fun Route.configureUserRoutes(userService: UserService) {
    authenticate("auth-jwt") {
        /**
         * 현재 사용자의 프로필을 가져오는 엔드포인트.
         * @return 200 OK. 사용자 프로필을 포함하며, 사용자가 없으면 404 Not Found를 반환합니다.
         */
        get("/api/users/me") {
            val userId = call.userId() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val user = userService.getUser(userId)
                ?: return@get call.respond(HttpStatusCode.NotFound)
            call.respond(user)
        }

        /**
         * 현재 사용자의 프로필을 업데이트하는 엔드포인트.
         * @param UpdateProfileRequest 업데이트된 이름이 포함된 요청 본문.
         * @return 200 OK. 업데이트된 사용자 프로필을 포함하며, 사용자가 없으면 404 Not Found를 반환합니다.
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
