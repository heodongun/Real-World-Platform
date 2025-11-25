@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import kotlinx.serialization.Serializable
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.UseSerializers
import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer

/**
 * 플랫폼의 코딩 문제를 나타냅니다.
 *
 * @property id 문제의 고유 식별자.
 * @property slug 문제에 대한 URL 친화적인 슬러그. 고유해야 합니다.
 * @property title 문제의 제목.
 * @property description 문제에 대한 자세한 설명.
 * @property difficulty 문제의 난이도 (예: "Easy", "Medium", "Hard").
 * @property language 문제의 프로그래밍 언어.
 * @property tags 문제와 관련된 태그 목록.
 * @property testFiles 테스트 파일 이름과 내용의 맵.
 * @property starterCode 사용자를 위한 선택적 스타터 코드 템플릿.
 * @property evaluationCriteria 이 문제에 대한 제출물을 평가하기 위한 기준.
 * @property performanceTarget 문제의 성능 목표 (밀리초 단위).
 * @property createdAt 문제가 생성된 타임스탬프.
 * @property updatedAt 문제가 마지막으로 업데이트된 타임스탬프.
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
 * 제출물을 평가하기 위한 기준을 정의합니다.
 *
 * @property functional 평가에서 기능적 정확성의 가중치.
 * @property codeQuality 평가에서 코드 품질의 가중치.
 * @property testCoverage 평가에서 테스트 커버리지의 가중치.
 * @property performance 평가에서 성능의 가중치.
 * @property total 모든 기준의 총 가중치.
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
