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
        '$2a$10$mockoltjelszohashhelyeadmin123456789012345678901234567890',
        (SELECT id FROM role WHERE name = 'ADMIN'),
        0,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Teszt Elek',
        'teszt.elek',
        '$2a$10$mockoltjelszohashhelyeteszt123456789012345678901234567890',
        (SELECT id FROM role WHERE name = 'USER'),
        0,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Minta Anna',
        'minta.anna',
        '$2a$10$mockoltjelszohashhelyeminta123456789012345678901234567890',
        (SELECT id FROM role WHERE name = 'USER'),
        1,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );