@file:UseSerializers(UUIDSerializer::class, InstantSerializer::class)

package com.codingplatform.models

import kotlinx.serialization.Serializable
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.UseSerializers
import com.codingplatform.utils.InstantSerializer
import com.codingplatform.utils.UUIDSerializer

/**
 * Represents a user of the coding platform.
 *
 * @property id The unique identifier for the user.
 * @property email The user's email address. Must be unique.
 * @property name The user's name.
 * @property role The user's role, which determines their permissions.
 * @property createdAt The timestamp when the user was created.
 * @property updatedAt The timestamp when the user was last updated.
 * @property lastLoginAt The timestamp of the user's last login. Can be null if the user has never logged in.
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
 * Defines the roles a user can have.
 */
enum class UserRole {
    /** An administrator with full access to the system. */
    ADMIN,
    /** A standard user with access to solving problems and viewing submissions. */
    USER
}
