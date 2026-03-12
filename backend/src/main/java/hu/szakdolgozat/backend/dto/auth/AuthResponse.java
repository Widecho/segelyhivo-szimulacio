package hu.szakdolgozat.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String username;
    private String role;
}