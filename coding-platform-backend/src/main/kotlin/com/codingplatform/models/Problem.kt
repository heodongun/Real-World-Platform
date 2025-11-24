@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import kotlinx.serialization.Serializable
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.UseSerializers
import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer

/**
 * Represents a coding problem on the platform.
 *
 * @property id The unique identifier for the problem.
 * @property slug A URL-friendly slug for the problem. Must be unique.
 * @property title The title of the problem.
 * @property description A detailed description of the problem.
 * @property difficulty The difficulty level of the problem (e.g., "Easy", "Medium", "Hard").
 * @property language The programming language for the problem.
 * @property tags A list of tags associated with the problem.
 * @property testFiles A map of test file names to their content.
 * @property starterCode Optional starter code template for users.
 * @property evaluationCriteria The criteria for evaluating submissions for this problem.
 * @property performanceTarget The performance target for the problem, in milliseconds.
 * @property createdAt The timestamp when the problem was created.
 * @property updatedAt The timestamp when the problem was last updated.
 */
@Serializable
data class Problem(
    val id: UUID,
    val slug: String,
    val title: String,
    val description: String,
    val difficulty: String,
    val language: Language,
    val tags: List<String>,
    val testFiles: Map<String, String>, // Test file name -> test code content
    val starterCode: String? = null, // Optional starter code template for users
    val evaluationCriteria: EvaluationCriteria,
    val performanceTarget: Int?,
    val createdAt: Instant,
    val updatedAt: Instant
)

/**
 * Defines the criteria for evaluating a submission.
 *
 * @property functional The weight of functional correctness in the evaluation.
 * @property codeQuality The weight of code quality in the evaluation.
 * @property testCoverage The weight of test coverage in the evaluation.
 * @property performance The weight of performance in the evaluation.
 * @property total The total weight of all criteria.
 */
@Serializable
data class EvaluationCriteria(
    val functional: Int,
    val codeQuality: Int,
    val testCoverage: Int,
    val performance: Int
) {
    val total: Int get() = functional + codeQuality + testCoverage + performance
}
