INSERT INTO scenario (
    id,
    title,
    category_id,
    audio_file_name,
    geo_address,
    latitude,
    longitude,
    expected_note,
    created_by_user_id,
    is_active,
    created_at,
    updated_at
)
VALUES
    (
        '112202603120000000001',
        'Családi ház tűzeset',
        (SELECT id FROM scenario_category WHERE name = 'Tűzeset'),
        'tuzeset_01.mp3',
        '3300 Eger, Kossuth Lajos utca 12.',
        47.9023000,
        20.3772000,
        'A bejelentő szerint családi ház tetőszerkezete ég, két fő tartózkodhat az ingatlanban.',
        (SELECT id FROM app_user WHERE username = 'admin'),
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '112202603120000000002',
        'Egészségügyi rosszullét',
        (SELECT id FROM scenario_category WHERE name = 'Egészségügyi eset'),
        'rosszullet_02.mp3',
        '3525 Miskolc, Széchenyi utca 8.',
        48.1031000,
        20.7902000,
        'Idős nő hirtelen rosszul lett, nehézlégzésre és mellkasi fájdalomra panaszkodik.',
        (SELECT id FROM app_user WHERE username = 'admin'),
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

INSERT INTO scenario_required_unit (scenario_id, emergency_unit_id)
VALUES
    (
        '112202603120000000001',
        (SELECT id FROM emergency_unit WHERE display_name = 'Heves Tűzoltóság')
    ),
    (
        '112202603120000000001',
        (SELECT id FROM emergency_unit WHERE display_name = 'Heves Mentőszolgálat')
    ),
    (
        '112202603120000000001',
        (SELECT id FROM emergency_unit WHERE display_name = 'Heves Rendőrség')
    ),
    (
        '112202603120000000002',
        (SELECT id FROM emergency_unit WHERE display_name = 'Borsod-Abaúj-Zemplén Mentőszolgálat')
    ),
    (
        '112202603120000000002',
        (SELECT id FROM emergency_unit WHERE display_name = 'Borsod-Abaúj-Zemplén Rendőrség')
    );