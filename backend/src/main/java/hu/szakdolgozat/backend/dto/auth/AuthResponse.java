package hu.szakdolgozat.backend.dto.auth;

public class AuthResponse {

    private boolean success;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static AuthResponse success(String message) {
        return new AuthResponse(true, message);
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}