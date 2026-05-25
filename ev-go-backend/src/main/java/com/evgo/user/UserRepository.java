package com.evgo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User} entities.
 *
 * Requirements: 19.1 (JWT auth – user lookup by email)
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their email address.
     * Used during authentication and registration duplicate checks.
     *
     * @param email the email address to look up
     * @return the matching user, or empty if not found
     */
    Optional<User> findByEmail(String email);
}
