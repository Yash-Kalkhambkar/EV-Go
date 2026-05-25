package com.evgo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * EV GO – Charging Station Booking System
 *
 * <p>Entry point for the Spring Boot application. The {@code @EnableScheduling}
 * annotation activates the scheduled jobs defined across the application:
 * <ul>
 *   <li>Stale reservation cleanup (every 60 s) – Req 13.1</li>
 *   <li>Webhook retry queue processing (every 10 s) – Req 4.4</li>
 *   <li>HikariCP metrics export (every 10 s) – Req 3.7</li>
 *   <li>Slot archival (weekly) – Req 10.7</li>
 * </ul>
 */
@SpringBootApplication
@EnableScheduling
public class EvGoApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvGoApplication.class, args);
    }
}
