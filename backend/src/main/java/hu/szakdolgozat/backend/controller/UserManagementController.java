package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserManagementController {

    private final AppUserRepository appUserRepository;

    public UserManagementController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/api/users/summary")
    public Map<String, Object> getUserSummary() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalUserCount", appUserRepository.count());
        response.put("activeUserCount", appUserRepository.findByIsActiveTrue().size());
        response.put("adminCount", appUserRepository.countByRole_Name("ADMIN"));
        response.put("normalUserCount", appUserRepository.countByRole_Name("USER"));
        return response;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/users/list")
    public List<Map<String, Object>> getUsers() {
        return appUserRepository.findAll()
                .stream()
                .map(this::mapUser)
                .toList();
    }

    private Map<String, Object> mapUser(AppUser user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("fullName", user.getFullName());
        result.put("username", user.getUsername());
        result.put("role", user.getRole().getName());
        result.put("failedLoginAttempts", user.getFailedLoginAttempts());
        result.put("isActive", user.getIsActive());
        result.put("createdAt", user.getCreatedAt());
        result.put("updatedAt", user.getUpdatedAt());
        return result;
    }
}