INSERT INTO app_user (
    full_name,
    username,
    password_hash,
    role_id,
    failed_login_attempts,
    is_active,
    created_at,
    updated_at
)
VALUES
    (
        'Admin Béla',
        'admin',
        '$2y$10$eaWbqCJcl9jUcJkPSWd5auqzsfgP5/DunyqekyE/0OdEI7pVH0E8e',
        (SELECT id FROM role WHERE name = 'ADMIN'),
        0,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Teszt Elek',
        'teszt.elek',
        '$2y$10$eaWbqCJcl9jUcJkPSWd5auqzsfgP5/DunyqekyE/0OdEI7pVH0E8e',
        (SELECT id FROM role WHERE name = 'USER'),
        0,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Minta Anna',
        'minta.anna',
        '$2y$10$eaWbqCJcl9jUcJkPSWd5auqzsfgP5/DunyqekyE/0OdEI7pVH0E8e',
        (SELECT id FROM role WHERE name = 'USER'),
        1,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );