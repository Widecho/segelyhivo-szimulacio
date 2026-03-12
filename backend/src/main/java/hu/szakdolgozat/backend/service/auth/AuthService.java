package hu.szakdolgozat.backend.service.auth;

import hu.szakdolgozat.backend.dto.auth.AuthResponse;
import hu.szakdolgozat.backend.dto.auth.LoginRequest;
import hu.szakdolgozat.backend.dto.auth.RegisterRequest;
import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.entity.Role;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import hu.szakdolgozat.backend.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final String USER_ROLE_NAME = "USER";
    private static final String ADMIN_ROLE_NAME = "ADMIN";
    private static final String DEFAULT_RESET_PASSWORD = "Abc123";

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository appUserRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String fullName = normalize(request.getFullName());
        String username = normalize(request.getUsername());
        String password = request.getPassword();

        if (fullName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A teljes név megadása kötelező.");
        }

        if (username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A felhasználónév megadása kötelező.");
        }

        validatePasswordRules(password);

        if (appUserRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ez a felhasználónév már foglalt.");
        }

        Role userRole = roleRepository.findByName(USER_ROLE_NAME)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "A USER szerepkör nem található az adatbázisban."
                ));

        AppUser user = new AppUser();
        user.setFullName(fullName);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(userRole);
        user.setFailedLoginAttempts(0);
        user.setIsActive(true);

        AppUser savedUser = appUserRepository.save(user);

        return new AuthResponse(
                "Sikeres regisztráció.",
                savedUser.getUsername(),
                savedUser.getRole().getName()
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String username = normalize(request.getUsername());
        String rawPassword = request.getPassword();

        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Hibás felhasználónév vagy jelszó."
                ));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A felhasználó inaktív.");
        }

        boolean passwordMatches = matchesPassword(rawPassword, user.getPasswordHash());

        if (passwordMatches) {
            if (user.getFailedLoginAttempts() != null && user.getFailedLoginAttempts() > 0) {
                user.setFailedLoginAttempts(0);
                appUserRepository.save(user);
            }

            return new AuthResponse(
                    "Sikeres bejelentkezés.",
                    user.getUsername(),
                    user.getRole().getName()
            );
        }

        int currentAttempts = user.getFailedLoginAttempts() == null ? 0 : user.getFailedLoginAttempts();
        int updatedAttempts = currentAttempts + 1;

        if (ADMIN_ROLE_NAME.equals(user.getRole().getName()) && updatedAttempts >= 3) {
            user.setPasswordHash(passwordEncoder.encode(DEFAULT_RESET_PASSWORD));
            user.setFailedLoginAttempts(0);
            appUserRepository.save(user);

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sikertelen bejelentkezés. Az admin jelszava 3 hibás próbálkozás után visszaállt az alapértelmezett Abc123 értékre."
            );
        }

        user.setFailedLoginAttempts(updatedAttempts);
        appUserRepository.save(user);

        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Hibás felhasználónév vagy jelszó."
        );
    }

    private void validatePasswordRules(String password) {
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A jelszó megadása kötelező.");
        }

        boolean hasUppercase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);

        if (!hasUppercase || !hasDigit) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A jelszónak tartalmaznia kell legalább egy nagybetűt és egy számot."
            );
        }
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        try {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}