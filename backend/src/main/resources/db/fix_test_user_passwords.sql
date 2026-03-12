UPDATE app_user
SET password_hash = '$2y$10$eaWbqCJcl9jUcJkPSWd5auqzsfgP5/DunyqekyE/0OdEI7pVH0E8e',
    failed_login_attempts = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE username IN ('admin', 'teszt.elek', 'minta.anna');