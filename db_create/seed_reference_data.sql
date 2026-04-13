INSERT INTO role (name) VALUES
('ADMIN'),
('USER');

INSERT INTO scenario_category (name) VALUES
('Tűzeset'),
('Egészségügyi eset'),
('Közlekedési baleset'),
('Rendészeti esemény'),
('Vegyes beavatkozást igénylő eset');

INSERT INTO emergency_service_type (code, display_name) VALUES
('FIRE', 'Tűzoltóság'),
('AMBULANCE', 'Mentőszolgálat'),
('POLICE', 'Rendőrség');

INSERT INTO region (code, display_name) VALUES
('BACS', 'Bács-Kiskun'),
('BARANYA', 'Baranya'),
('BEKES', 'Békés'),
('BAZ', 'Borsod-Abaúj-Zemplén'),
('CSONGRAD', 'Csongrád-Csanád'),
('FEJER', 'Fejér'),
('GYOR', 'Győr-Moson-Sopron'),
('HAJDU', 'Hajdú-Bihar'),
('HEVES', 'Heves'),
('JASZ', 'Jász-Nagykun-Szolnok'),
('KOMAROM', 'Komárom-Esztergom'),
('NOGRAD', 'Nógrád'),
('PEST', 'Pest'),
('SOMOGY', 'Somogy'),
('SZABOLCS', 'Szabolcs-Szatmár-Bereg'),
('TOLNA', 'Tolna'),
('VAS', 'Vas'),
('VESZPREM', 'Veszprém'),
('ZALA', 'Zala'),
('DUNAI_VIZI', 'Dunai Vízirendészet'),
('TISZAI_VIZI', 'Tiszai Vízirendészet'),
('BALATONI_VIZI', 'Balatoni Vízirendészet');

INSERT INTO emergency_unit (service_type_id, region_id, display_name)
SELECT est.id, r.id, r.display_name || ' Tűzoltóság'
FROM emergency_service_type est
JOIN region r ON r.code IN (
    'BACS','BARANYA','BEKES','BAZ','CSONGRAD','FEJER','GYOR','HAJDU','HEVES',
    'JASZ','KOMAROM','NOGRAD','PEST','SOMOGY','SZABOLCS','TOLNA','VAS','VESZPREM','ZALA'
)
WHERE est.code = 'FIRE';

INSERT INTO emergency_unit (service_type_id, region_id, display_name)
SELECT est.id, r.id, r.display_name || ' Mentőszolgálat'
FROM emergency_service_type est
JOIN region r ON r.code IN (
    'BACS','BARANYA','BEKES','BAZ','CSONGRAD','FEJER','GYOR','HAJDU','HEVES',
    'JASZ','KOMAROM','NOGRAD','PEST','SOMOGY','SZABOLCS','TOLNA','VAS','VESZPREM','ZALA'
)
WHERE est.code = 'AMBULANCE';

INSERT INTO emergency_unit (service_type_id, region_id, display_name)
SELECT est.id, r.id,
       CASE
           WHEN r.code = 'DUNAI_VIZI' THEN 'Dunai Vízirendészet'
           WHEN r.code = 'TISZAI_VIZI' THEN 'Tiszai Vízirendészet'
           WHEN r.code = 'BALATONI_VIZI' THEN 'Balatoni Vízirendészet'
           ELSE r.display_name || ' Rendőrség'
       END
FROM emergency_service_type est
JOIN region r ON r.code IN (
    'BACS','BARANYA','BEKES','BAZ','CSONGRAD','FEJER','GYOR','HAJDU','HEVES',
    'JASZ','KOMAROM','NOGRAD','PEST','SOMOGY','SZABOLCS','TOLNA','VAS','VESZPREM','ZALA',
    'DUNAI_VIZI','TISZAI_VIZI','BALATONI_VIZI'
)
WHERE est.code = 'POLICE';