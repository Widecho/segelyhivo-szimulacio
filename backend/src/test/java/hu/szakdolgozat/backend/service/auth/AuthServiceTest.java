package hu.szakdolgozat.backend.service.auth;

import hu.szakdolgozat.backend.dto.auth.AuthResponse;
import hu.szakdolgozat.backend.dto.auth.RegisterRequest;
import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.entity.Role;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import hu.szakdolgozat.backend.repository.RoleRepository;
import hu.szakdolgozat.backend.security.JwtService;
import hu.szakdolgozat.backend.dto.auth.LoginRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void sikeresRegisztracio() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Teszt Béla");
        request.setUsername("teszt");
        request.setPassword("Abc123");

        Role role = new Role();
        role.setName("USER");

        when(appUserRepository.existsByUsername("teszt")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("Abc123")).thenReturn("titkositott-jelszo");
        when(appUserRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("teszt", response.getUsername());
        assertEquals("USER", response.getRole());
        assertEquals("jwt-token", response.getToken());

        verify(appUserRepository).save(any(AppUser.class));
    }

    @Test
    void foglaltFelhasznalonev() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Teszt Béla");
        request.setUsername("teszt");
        request.setPassword("Abc123");

        when(appUserRepository.existsByUsername("teszt")).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> authService.register(request));

        verify(appUserRepository, never()).save(any(AppUser.class));
    }
    @Test
    void hibasJelszo() {
        LoginRequest request = new LoginRequest();
        request.setUsername("teszt");
        request.setPassword("RosszJelszo1");

        Role role = new Role();
        role.setName("USER");

        AppUser user = new AppUser();
        user.setUsername("teszt");
        user.setPasswordHash("titkositott-jelszo");
        user.setRole(role);
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);

        when(appUserRepository.findByUsername("teszt")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("RosszJelszo1", "titkositott-jelszo")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.login(request));

        verify(jwtService, never()).generateToken(any(AppUser.class));
        verify(appUserRepository).save(any(AppUser.class));
    }
    @Test
    void sikeresBejelentkezes() {
        LoginRequest request = new LoginRequest();
        request.setUsername("teszt");
        request.setPassword("Abc123");
        Role role = new Role();
        role.setName("USER");
        AppUser user = new AppUser();
        user.setUsername("teszt");
        user.setPasswordHash("titkositott-jelszo");
        user.setRole(role);
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);
        when(appUserRepository.findByUsername("teszt")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Abc123", "titkositott-jelszo")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("teszt", response.getUsername());
        assertEquals("USER", response.getRole());
        assertEquals("jwt-token", response.getToken());

        verify(jwtService).generateToken(user);
        verify(appUserRepository, never()).save(any(AppUser.class));
    }
    @Test
    void nemLetezoFelhasznalo() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nincsilyen");
        request.setPassword("Abc123");

        when(appUserRepository.findByUsername("nincsilyen")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> authService.login(request));

        verify(jwtService, never()).generateToken(any(AppUser.class));
        verify(appUserRepository, never()).save(any(AppUser.class));
    }
    @Test
    void inaktivFelhasznaloNemJelentkezhetBe() {
        LoginRequest request = new LoginRequest();
        request.setUsername("teszt");
        request.setPassword("Abc123");

        Role role = new Role();
        role.setName("USER");

        AppUser user = new AppUser();
        user.setUsername("teszt");
        user.setPasswordHash("titkositott-jelszo");
        user.setRole(role);
        user.setIsActive(false);
        user.setFailedLoginAttempts(0);

        when(appUserRepository.findByUsername("teszt")).thenReturn(Optional.of(user));

        assertThrows(ResponseStatusException.class, () -> authService.login(request));

        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtService, never()).generateToken(any(AppUser.class));
    }
}

