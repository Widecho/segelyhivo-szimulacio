package hu.szakdolgozat.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "A felhasználónév megadása kötelező.")
    private String username;

    @NotBlank(message = "A jelszó megadása kötelező.")
    private String password;
}