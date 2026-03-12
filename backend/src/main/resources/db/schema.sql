CREATE TABLE role (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE app_user (
                          id BIGSERIAL PRIMARY KEY,
                          full_name VARCHAR(150) NOT NULL,
                          username VARCHAR(100) NOT NULL UNIQUE,
                          password_hash VARCHAR(255) NOT NULL,
                          role_id BIGINT NOT NULL,
                          failed_login_attempts INTEGER NOT NULL DEFAULT 0,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_app_user_role
                              FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE scenario_category (
                                   id BIGSERIAL PRIMARY KEY,
                                   name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE emergency_service_type (
                                        id BIGSERIAL PRIMARY KEY,
                                        code VARCHAR(30) NOT NULL UNIQUE,
                                        display_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE region (
                        id BIGSERIAL PRIMARY KEY,
                        code VARCHAR(20) NOT NULL UNIQUE,
                        display_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE emergency_unit (
                                id BIGSERIAL PRIMARY KEY,
                                service_type_id BIGINT NOT NULL,
                                region_id BIGINT NOT NULL,
                                display_name VARCHAR(150) NOT NULL UNIQUE,
                                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                CONSTRAINT fk_emergency_unit_service_type
                                    FOREIGN KEY (service_type_id) REFERENCES emergency_service_type(id),
                                CONSTRAINT fk_emergency_unit_region
                                    FOREIGN KEY (region_id) REFERENCES region(id),
                                CONSTRAINT uq_emergency_unit_service_region
                                    UNIQUE (service_type_id, region_id)
);

CREATE TABLE scenario (
                          id VARCHAR(21) PRIMARY KEY,
                          title VARCHAR(200) NOT NULL,
                          category_id BIGINT NOT NULL,
                          audio_file_name VARCHAR(255) NOT NULL,
                          geo_address VARCHAR(255) NOT NULL,
                          latitude NUMERIC(10, 7) NOT NULL,
                          longitude NUMERIC(10, 7) NOT NULL,
                          expected_note TEXT NOT NULL,
                          created_by_user_id BIGINT NOT NULL,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_scenario_category
                              FOREIGN KEY (category_id) REFERENCES scenario_category(id),
                          CONSTRAINT fk_scenario_created_by
                              FOREIGN KEY (created_by_user_id) REFERENCES app_user(id)
);

CREATE TABLE scenario_required_unit (
                                        id BIGSERIAL PRIMARY KEY,
                                        scenario_id VARCHAR(21) NOT NULL,
                                        emergency_unit_id BIGINT NOT NULL,
                                        CONSTRAINT fk_scenario_required_unit_scenario
                                            FOREIGN KEY (scenario_id) REFERENCES scenario(id) ON DELETE CASCADE,
                                        CONSTRAINT fk_scenario_required_unit_unit
                                            FOREIGN KEY (emergency_unit_id) REFERENCES emergency_unit(id),
                                        CONSTRAINT uq_scenario_required_unit
                                            UNIQUE (scenario_id, emergency_unit_id)
);

CREATE TABLE simulation_attempt (
                                    id BIGSERIAL PRIMARY KEY,
                                    scenario_id VARCHAR(21) NOT NULL,
                                    user_id BIGINT NOT NULL,
                                    caller_name VARCHAR(150) NOT NULL,
                                    caller_phone VARCHAR(50) NOT NULL,
                                    location_text VARCHAR(255) NOT NULL,
                                    event_description VARCHAR(255) NOT NULL,
                                    user_note TEXT NOT NULL,
                                    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    submitted_at TIMESTAMP,
                                    evaluation_status VARCHAR(30) NOT NULL,
                                    score INTEGER,
                                    matched_unit_count INTEGER NOT NULL DEFAULT 0,
                                    missing_unit_count INTEGER NOT NULL DEFAULT 0,
                                    incorrect_unit_count INTEGER NOT NULL DEFAULT 0,
                                    note_evaluation_status VARCHAR(30),
                                    evaluator_summary TEXT,
                                    CONSTRAINT fk_simulation_attempt_scenario
                                        FOREIGN KEY (scenario_id) REFERENCES scenario(id),
                                    CONSTRAINT fk_simulation_attempt_user
                                        FOREIGN KEY (user_id) REFERENCES app_user(id)
);

CREATE TABLE simulation_attempt_selected_unit (
                                                  id BIGSERIAL PRIMARY KEY,
                                                  simulation_attempt_id BIGINT NOT NULL,
                                                  emergency_unit_id BIGINT NOT NULL,
                                                  CONSTRAINT fk_attempt_selected_unit_attempt
                                                      FOREIGN KEY (simulation_attempt_id) REFERENCES simulation_attempt(id) ON DELETE CASCADE,
                                                  CONSTRAINT fk_attempt_selected_unit_unit
                                                      FOREIGN KEY (emergency_unit_id) REFERENCES emergency_unit(id),
                                                  CONSTRAINT uq_attempt_selected_unit
                                                      UNIQUE (simulation_attempt_id, emergency_unit_id)
);

CREATE TABLE simulation_attempt_feedback_item (
                                                  id BIGSERIAL PRIMARY KEY,
                                                  simulation_attempt_id BIGINT NOT NULL,
                                                  feedback_type VARCHAR(30) NOT NULL,
                                                  message TEXT NOT NULL,
                                                  CONSTRAINT fk_attempt_feedback_item_attempt
                                                      FOREIGN KEY (simulation_attempt_id) REFERENCES simulation_attempt(id) ON DELETE CASCADE
);

CREATE INDEX idx_app_user_role_id ON app_user(role_id);
CREATE INDEX idx_emergency_unit_service_type_id ON emergency_unit(service_type_id);
CREATE INDEX idx_emergency_unit_region_id ON emergency_unit(region_id);
CREATE INDEX idx_scenario_category_id ON scenario(category_id);
CREATE INDEX idx_scenario_created_by_user_id ON scenario(created_by_user_id);
CREATE INDEX idx_scenario_required_unit_scenario_id ON scenario_required_unit(scenario_id);
CREATE INDEX idx_scenario_required_unit_emergency_unit_id ON scenario_required_unit(emergency_unit_id);
CREATE INDEX idx_simulation_attempt_scenario_id ON simulation_attempt(scenario_id);
CREATE INDEX idx_simulation_attempt_user_id ON simulation_attempt(user_id);
CREATE INDEX idx_simulation_attempt_selected_unit_attempt_id ON simulation_attempt_selected_unit(simulation_attempt_id);
CREATE INDEX idx_simulation_attempt_feedback_item_attempt_id ON simulation_attempt_feedback_item(simulation_attempt_id);