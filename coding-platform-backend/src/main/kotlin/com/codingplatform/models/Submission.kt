@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers

/**
 * Represents a user's submission for a problem.
 *
 * @property id The unique identifier for the submission.
 * @property userId The ID of the user who made the submission.
 * @property problemId The ID of the problem for which the submission was made.
 * @property status The current status of the submission.
 * @property files A map of file names to their content for the submission.
 * @property score The score awarded to the submission.
 * @property feedback Detailed feedback on the submission. Can be null if feedback is not yet available.
 * @property createdAt The timestamp when the submission was created.
 * @property updatedAt The timestamp when the submission was last updated.
 */
@Serializable
data class Submission(
    val id: String,
    val userId: UUID,
    val problemId: UUID,
    val status: SubmissionStatus,
    val files: Map<String, String>,
    val score: Int,
    val feedback: SubmissionFeedback?,
    val createdAt: Instant,
    val updatedAt: Instant
)

/**
 * Defines the possible statuses of a submission.
 */
enum class SubmissionStatus {
    /** The submission is pending execution. */
    PENDING,
    /** The submission is currently being executed. */
    RUNNING,
    /** The submission has been successfully executed and evaluated. */
    COMPLETED,
    /** The submission failed to execute or evaluate. */
    FAILED
}

/**
 * Represents detailed feedback for a submission.
 *
 * @property totalTests The total number of tests run.
 * @property passedTests The number of tests that passed.
 * @property failedTests The number of tests that failed.
 * @property passRate The pass rate of the tests, as a percentage.
 * @property score The score awarded based on the feedback.
 * @property status The execution status of the submission.
 * @property testResults Detailed results of the tests.
 * @property output The output of the submission's execution.
 * @property message A message summarizing the feedback.
 */
@Serializable
data class SubmissionFeedback(
    val totalTests: Int,
    val passedTests: Int,
    val failedTests: Int,
    val passRate: Double,
    val score: Int,
    val status: ExecutionStatus,
    val testResults: TestResults,
    val output: String,
    val message: String
)
