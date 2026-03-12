package hu.szakdolgozat.backend.service.auth;

import hu.szakdolgozat.backend.dto.auth.AuthResponse;
import hu.szakdolgozat.backend.dto.auth.LoginRequest;
import hu.szakdolgozat.backend.dto.auth.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public AuthResponse register(RegisterRequest request) {
        return AuthResponse.success(
                "Mock regisztráció sikeres: " + request.getUsername()
        );
    }

    public AuthResponse login(LoginRequest request) {
        return AuthResponse.success(
                "Mock bejelentkezés sikeres: " + request.getUsername()
        );
    }
}