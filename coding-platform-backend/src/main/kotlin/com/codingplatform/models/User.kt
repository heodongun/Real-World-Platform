@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import kotlinx.serialization.Serializable
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.UseSerializers
import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer

/**
 * 코딩 플랫폼의 사용자를 나타냅니다.
 *
 * @property id 사용자의 고유 식별자.
 * @property email 사용자의 이메일 주소. 고유해야 합니다.
 * @property name 사용자의 이름.
 * @property role 사용자의 역할. 권한을 결정합니다.
 * @property createdAt 사용자가 생성된 타임스탬프.
 * @property updatedAt 사용자가 마지막으로 업데이트된 타임스탬프.
 * @property lastLoginAt 사용자의 마지막 로그인 타임스탬프. 사용자가 로그인한 적이 없으면 null일 수 있습니다.
 */
@Serializable
data class User(
    val id: UUID,
    val email: String,
    val name: String,
    val role: UserRole,
    val createdAt: Instant,
    val updatedAt: Instant,
    val lastLoginAt: Instant?
)

/**
 * 사용자가 가질 수 있는 역할을 정의합니다.
 */
enum class UserRole {
    /** 시스템에 대한 모든 권한을 가진 관리자. */
    ADMIN,
    /** 문제 풀기 및 제출물 보기에 대한 액세스 권한이 있는 표준 사용자. */
    USER
}
