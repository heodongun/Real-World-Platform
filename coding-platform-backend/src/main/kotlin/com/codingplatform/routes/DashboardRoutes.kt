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
 * Configures routes related to the dashboard and system metrics.
 * @param dashboardService The service for retrieving dashboard data.
 * @param registry The Prometheus meter registry for scraping metrics.
 */
fun Route.configureDashboardRoutes(
    dashboardService: DashboardService,
    registry: PrometheusMeterRegistry
) {
    /**
     * Health check endpoint.
     * @return 200 OK with a status message.
     */
    get("/health") {
        call.respond(mapOf("status" to "OK"))
    }

    route("/api/dashboard") {
        /**
         * Endpoint to get dashboard statistics.
         * @return 200 OK with dashboard statistics.
         */
        get("/stats") {
            call.respond(dashboardService.getStats())
        }
    }

    /**
     * Endpoint to get the leaderboard.
     * @return 200 OK with leaderboard data.
     */
    get("/api/leaderboard") {
        call.respond(dashboardService.getLeaderboard())
    }

    /**
     * Endpoint for scraping Prometheus metrics.
     * @return 200 OK with metrics in plain text format.
     */
    get("/metrics") {
        call.respondText(registry.scrape(), ContentType.parse("text/plain"))
    }
}
