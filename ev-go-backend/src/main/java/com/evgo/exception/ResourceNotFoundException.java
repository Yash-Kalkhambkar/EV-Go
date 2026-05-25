package com.evgo.exception;

/**
 * Thrown when a requested resource (user, station, slot, booking, payment)
 * cannot be found in the database.
 *
 * Requirements: 18.1
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceType, Long id) {
        super(resourceType + " not found with id: " + id);
    }
}
