export const createResults = `CREATE TABLE IF NOT EXISTS speed_test_results (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    download_speed NUMERIC(10, 3),
    upload_speed NUMERIC(10, 3),
    ping INTEGER,
    jitter INTEGER,
    download_data_mb NUMERIC(10, 3),
    upload_data_mb NUMERIC(10, 3),
    user_agent TEXT,
    ip_address INET,
    hostname TEXT,
    server_ip TEXT,
    data_sent_bytes BIGINT,
    data_received_bytes BIGINT
);`;

export const createIndex = `CREATE INDEX IF NOT EXISTS idx_created_at ON speed_test_results(created_at);`;