package hu.szakdolgozat.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "OK",
                "message", "A backend rendben fut."
        );
    }

    @GetMapping("/api/health/db")
    public Map<String, Object> databaseHealth() {
        Integer roleCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM role",
                Integer.class
        );

        return Map.of(
                "status", "OK",
                "message", "Az adatbázis kapcsolat rendben működik.",
                "roleCount", roleCount
        );
    }
}