INSERT INTO simulation_attempt (
    scenario_id,
    user_id,
    caller_name,
    caller_phone,
    location_text,
    event_description,
    user_note,
    started_at,
    submitted_at,
    evaluation_status,
    score,
    matched_unit_count,
    missing_unit_count,
    incorrect_unit_count,
    note_evaluation_status,
    evaluator_summary
)
VALUES
    (
        '112202603120000000001',
        (SELECT id FROM app_user WHERE username = 'teszt.elek'),
        'Kovács Péter',
        '+36301234567',
        '3300 Eger, Kossuth Lajos utca 12.',
        'Családi ház teteje ég',
        'A bejelentő szerint a tetőszerkezet ég, bent két fő lehet, gyors beavatkozás szükséges.',
        CURRENT_TIMESTAMP - INTERVAL '20 minutes',
        CURRENT_TIMESTAMP - INTERVAL '17 minutes',
        'SUCCESS',
        92,
        3,
        0,
        0,
        'MATCHED',
        'A kiválasztott egységek helyesek voltak, a jegyzet megfelelően fedte le az esemény lényegét.'
    ),
    (
        '112202603120000000002',
        (SELECT id FROM app_user WHERE username = 'minta.anna'),
        'Nagy Mária',
        '+36305554444',
        '3525 Miskolc, Széchenyi utca 8.',
        'Idős nő rosszul lett',
        'A bejelentő szerint egy idős nő nehezen kap levegőt és mellkasi panaszai vannak.',
        CURRENT_TIMESTAMP - INTERVAL '10 minutes',
        CURRENT_TIMESTAMP - INTERVAL '7 minutes',
        'PARTIAL_SUCCESS',
        68,
        1,
        1,
        1,
        'PARTIAL_MATCH',
        'A fő esemény felismerése rendben volt, de az egységkijelölés nem volt teljesen pontos.'
    );

INSERT INTO simulation_attempt_selected_unit (simulation_attempt_id, emergency_unit_id)
VALUES
    (
        (SELECT id FROM simulation_attempt WHERE caller_name = 'Kovács Péter' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM emergency_unit WHERE display_name = 'Heves Tűzoltóság')
    ),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Kovács Péter' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM emergency_unit WHERE display_name = 'Heves Mentőszolgálat')
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Kovács Péter' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM emergency_unit WHERE display_name = 'Heves Rendőrség')
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Nagy Mária' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM emergency_unit WHERE display_name = 'Borsod-Abaúj-Zemplén Mentőszolgálat')
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Nagy Mária' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM emergency_unit WHERE display_name = 'Heves Rendőrség')
);

INSERT INTO simulation_attempt_feedback_item (simulation_attempt_id, feedback_type, message)
VALUES
    (
        (SELECT id FROM simulation_attempt WHERE caller_name = 'Kovács Péter' ORDER BY id DESC LIMIT 1),
    'SUCCESS',
    'A megfelelő tűzoltó, mentő és rendőri egységek kiválasztása megtörtént.'
    ),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Kovács Péter' ORDER BY id DESC LIMIT 1),
    'SUCCESS',
    'A jegyzet jól összefoglalta a veszélyhelyzetet.'
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Nagy Mária' ORDER BY id DESC LIMIT 1),
    'ERROR',
    'Hiányzott a területileg illetékes rendőri egység.'
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Nagy Mária' ORDER BY id DESC LIMIT 1),
    'ERROR',
    'Egy nem megfelelő rendőri egység került kijelölésre.'
),
(
    (SELECT id FROM simulation_attempt WHERE caller_name = 'Nagy Mária' ORDER BY id DESC LIMIT 1),
    'INFO',
    'A jegyzet részben megfelelő volt, de pontosítható.'
);