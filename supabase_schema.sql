-- -------------------------------------------------
-- Supabase Schema – Absensi KSPM
-- -------------------------------------------------

-- 1️⃣ Employees (Karyawan/Anggota)
CREATE TABLE IF NOT EXISTS employees (
    id            TEXT    PRIMARY KEY,       -- contoh: "KSPM-001"
    name          TEXT    NOT NULL,
    dept          TEXT,                     
    avatar        TEXT,                     
    color         TEXT,                     
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2️⃣ Attendance (Log Kehadiran)
CREATE TABLE IF NOT EXISTS attendance (
    id            TEXT    PRIMARY KEY,       -- unik, contoh "ATT-20241002-1234"
    emp_id        TEXT    NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    name          TEXT,                     
    date          DATE    NOT NULL,        
    time          TIME    NOT NULL,        
    type          TEXT    NOT NULL,        -- "MASUK" | "PULANG"
    category      TEXT    NOT NULL DEFAULT 'biasa',   
    replaced_date DATE,                     
    reason        TEXT,                     
    status        TEXT,                     
    shift_id      TEXT,                     
    location      TEXT,                     
    photo         TEXT,                     
    notes         TEXT,                     
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3️⃣ Schedules (Jadwal Piket)
CREATE TABLE IF NOT EXISTS schedules (
    id            TEXT    PRIMARY KEY,
    emp_id        TEXT    NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date          DATE    NOT NULL,
    shift_id      TEXT    NOT NULL,        
    category      TEXT    NOT NULL DEFAULT 'biasa',   
    replaced_date DATE,                     
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4️⃣ Holidays (Hari Libur Nasional/Kampus)
CREATE TABLE IF NOT EXISTS holidays (
    id            SERIAL  PRIMARY KEY,
    date          DATE    NOT NULL,
    name          TEXT,                     
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5️⃣ Settings (Konfigurasi Sistem)
CREATE TABLE IF NOT EXISTS settings (
    id            SERIAL  PRIMARY KEY,
    key           TEXT    NOT NULL UNIQUE,
    value         TEXT    NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------
-- Indexes untuk performa
-- -------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance (emp_id, date);
CREATE INDEX IF NOT EXISTS idx_schedules_emp_date ON schedules (emp_id, date);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays (date);
