@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers

/**
 * 문제에 대한 사용자의 제출물을 나타냅니다.
 *
 * @property id 제출물의 고유 식별자.
 * @property userId 제출물을 만든 사용자의 ID.
 * @property problemId 제출물이 만들어진 문제의 ID.
 * @property status 제출물의 현재 상태.
 * @property files 제출물에 대한 파일 이름과 내용의 맵.
 * @property score 제출물에 부여된 점수.
 * @property feedback 제출물에 대한 자세한 피드백. 피드백이 아직 제공되지 않은 경우 null일 수 있습니다.
 * @property createdAt 제출물이 생성된 타임스탬프.
 * @property updatedAt 제출물이 마지막으로 업데이트된 타임스탬프.
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
 * 제출물의 가능한 상태를 정의합니다.
 */
enum class SubmissionStatus {
    /** 제출물이 실행 대기 중입니다. */
    PENDING,
    /** 제출물이 현재 실행 중입니다. */
    RUNNING,
    /** 제출물이 성공적으로 실행되고 평가되었습니다. */
    COMPLETED,
    /** 제출물 실행 또는 평가에 실패했습니다. */
    FAILED
}

/**
 * 제출물에 대한 자세한 피드백을 나타냅니다.
 *
 * @property totalTests 실행된 총 테스트 수.
 * @property passedTests 통과한 테스트 수.
 * @property failedTests 실패한 테스트 수.
 * @property passRate 테스트 통과율 (백분율).
 * @property score 피드백을 기반으로 부여된 점수.
 * @property status 제출물의 실행 상태.
 * @property testResults 테스트의 자세한 결과.
 * @property output 제출물 실행의 출력.
 * @property message 피드백을 요약하는 메시지.
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
