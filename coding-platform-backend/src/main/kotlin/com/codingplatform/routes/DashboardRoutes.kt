package com.codingplatform.routes

import com.codingplatform.services.DashboardService
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.micrometer.prometheus.PrometheusMeterRegistry

/**
 * 대시보드 및 시스템 메트릭 관련 라우트를 구성합니다.
 * @param dashboardService 대시보드 데이터 조회를 위한 서비스.
 * @param registry 메트릭 스크래핑을 위한 Prometheus 미터 레지스트리.
 */
fun Route.configureDashboardRoutes(
    dashboardService: DashboardService,
    registry: PrometheusMeterRegistry
) {
    /**
     * 상태 확인 엔드포인트.
     * @return 200 OK. 상태 메시지를 포함합니다.
     */
    get("/health") {
        call.respond(mapOf("status" to "OK"))
    }

    route("/api/dashboard") {
        /**
         * 대시보드 통계를 가져오는 엔드포인트.
         * @return 200 OK. 대시보드 통계를 포함합니다.
         */
        get("/stats") {
            call.respond(dashboardService.getStats())
        }
    }

    /**
     * 리더보드를 가져오는 엔드포인트.
     * @return 200 OK. 리더보드 데이터를 포함합니다.
     */
    get("/api/leaderboard") {
        call.respond(dashboardService.getLeaderboard())
    }

    /**
     * Prometheus 메트릭을 스크래핑하기 위한 엔드포인트.
     * @return 200 OK. 일반 텍스트 형식의 메트릭을 포함합니다.
     */
    get("/metrics") {
        call.respondText(registry.scrape(), ContentType.parse("text/plain"))
    }
}
