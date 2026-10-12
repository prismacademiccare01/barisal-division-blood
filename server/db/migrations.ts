import { db } from './database.js';

export function runMigrations() {
  console.log('[DB] Running database migrations...');

  // Track applied migrations
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const appliedRows = db.prepare('SELECT version FROM schema_migrations').all() as { version: number }[];
  const applied = new Set(appliedRows.map((r) => r.version));

  // Migration 1: Core tables & relationships
  if (!applied.has(1)) {
    db.exec(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'donor', -- 'visitor', 'donor', 'requester', 'hospital', 'admin', 'super_admin'
        password_hash TEXT,
        salt TEXT,
        name TEXT NOT NULL,
        avatar TEXT,
        status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'pending'
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

      -- Donors profile table
      CREATE TABLE IF NOT EXISTS donors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        blood_group TEXT NOT NULL, -- 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
        gender TEXT NOT NULL, -- 'male', 'female', 'other'
        age INTEGER,
        dob TEXT,
        district TEXT NOT NULL DEFAULT 'বরিশাল',
        upazila TEXT NOT NULL,
        area TEXT,
        address TEXT,
        last_donation_date TEXT,
        total_donations INTEGER NOT NULL DEFAULT 0,
        is_available INTEGER NOT NULL DEFAULT 1, -- 1=yes, 0=no
        is_verified INTEGER NOT NULL DEFAULT 0,
        verification_notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
      CREATE INDEX IF NOT EXISTS idx_donors_district_upazila ON donors(district, upazila);
      CREATE INDEX IF NOT EXISTS idx_donors_is_available ON donors(is_available);
      CREATE INDEX IF NOT EXISTS idx_donors_is_verified ON donors(is_verified);

      -- Admins table
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        permissions TEXT NOT NULL DEFAULT 'all', -- JSON array or comma list
        level TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Sessions table
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

      -- OTP codes table
      CREATE TABLE IF NOT EXISTS otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        purpose TEXT NOT NULL DEFAULT 'login', -- 'login', 'register', 'reset_pin'
        attempts INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT NOT NULL,
        verified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);

      -- Hospitals table
      CREATE TABLE IF NOT EXISTS hospitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        district TEXT NOT NULL DEFAULT 'বরিশাল',
        upazila TEXT NOT NULL,
        phone TEXT NOT NULL,
        emergency_contact TEXT,
        is_verified INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district, upazila);

      -- Blood Requests table
      CREATE TABLE IF NOT EXISTS blood_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        patient_name TEXT NOT NULL,
        blood_group TEXT NOT NULL,
        units_needed INTEGER NOT NULL DEFAULT 1,
        hospital_name TEXT NOT NULL,
        district TEXT NOT NULL DEFAULT 'বরিশাল',
        upazila TEXT NOT NULL,
        location_details TEXT,
        needed_date TEXT NOT NULL,
        needed_time TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        emergency_level TEXT NOT NULL DEFAULT 'urgent', -- 'critical', 'urgent', 'standard'
        case_info TEXT, -- e.g. 'থ্যালাসেমিয়া', 'অপারেশন', 'দুর্ঘটনা', 'ডেলিভারি'
        additional_notes TEXT,
        status TEXT NOT NULL DEFAULT 'active', -- 'pending', 'active', 'fulfilled', 'cancelled', 'expired'
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(status);
      CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON blood_requests(blood_group);
      CREATE INDEX IF NOT EXISTS idx_requests_district ON blood_requests(district, upazila);
      CREATE INDEX IF NOT EXISTS idx_requests_emergency ON blood_requests(emergency_level);

      -- Request Responses (Donor responding to a blood request)
      CREATE TABLE IF NOT EXISTS request_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        donor_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'accepted', -- 'accepted', 'declined', 'maybe'
        donor_message TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(request_id, donor_id),
        FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
        FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_responses_req ON request_responses(request_id);

      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'system', -- 'blood_request', 'emergency', 'accepted', 'completed', 'broadcast'
        is_read INTEGER NOT NULL DEFAULT 0,
        metadata_json TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

      -- Broadcasts table
      CREATE TABLE IF NOT EXISTS broadcasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        target_group TEXT NOT NULL DEFAULT 'all', -- 'all', 'donors', 'blood_group_A+', etc.
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
      );

      -- Abuse/Reports table
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER,
        reported_type TEXT NOT NULL, -- 'donor', 'request', 'hospital'
        reported_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
        admin_notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
      );

      -- Favorites / Bookmarks table
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        donor_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, donor_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
      );

      -- Donor Devices (for push token or app token)
      CREATE TABLE IF NOT EXISTS donor_devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        device_token TEXT NOT NULL,
        platform TEXT NOT NULL DEFAULT 'pwa', -- 'pwa', 'android', 'ios'
        last_active TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, device_token),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Push Subscriptions (standard Web Push API)
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        keys_json TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Audit Logs (admin actions, security events)
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        target_type TEXT,
        target_id INTEGER,
        details_json TEXT,
        ip TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at);
    `);

    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(1, 'core_tables');
    console.log('[DB] Applied migration 1: core_tables');
  }

  // Migration 2: Hospital Blood Stock Inventory
  if (!applied.has(2)) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS blood_stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hospital_id INTEGER NOT NULL,
        blood_group TEXT NOT NULL,
        units INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'available', -- 'available', 'low', 'critical'
        last_updated TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(hospital_id, blood_group),
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_blood_stocks_hospital ON blood_stocks(hospital_id);
    `);

    // Seed initial blood stock levels for existing hospitals
    const hospitals = db.prepare('SELECT id FROM hospitals').all() as { id: number }[];
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (const h of hospitals) {
      for (const bg of groups) {
        // Vary stock for realism
        const isRare = bg.includes('-');
        const units = isRare ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 12) + 2;
        const status = units <= 1 ? 'critical' : units <= 4 ? 'low' : 'available';
        db.prepare(`
          INSERT OR IGNORE INTO blood_stocks (hospital_id, blood_group, units, status)
          VALUES (?, ?, ?, ?)
        `).run(h.id, bg, units, status);
      }
    }

    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(2, 'blood_stocks');
    console.log('[DB] Applied migration 2: blood_stocks');
  }

  // Migration 3: Cloudflare D1 & R2 Schema Migration
  if (!applied.has(3)) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS r2_media_objects (
        id TEXT PRIMARY KEY,
        r2_bucket TEXT NOT NULL DEFAULT 'barishal-Blood-media',
        r2_key TEXT UNIQUE NOT NULL,
        public_url TEXT NOT NULL,
        file_name TEXT NOT NULL,
        content_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        user_id INTEGER,
        album_id TEXT,
        caption TEXT,
        entity_type TEXT NOT NULL DEFAULT 'post',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_r2_media_key ON r2_media_objects(r2_key);

      CREATE TABLE IF NOT EXISTS d1_donation_albums (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        caption TEXT,
        hospital_name TEXT NOT NULL,
        blood_group TEXT NOT NULL,
        donation_date TEXT NOT NULL,
        donation_number INTEGER DEFAULT 1,
        cover_r2_url TEXT NOT NULL,
        r2_photos_json TEXT NOT NULL DEFAULT '[]',
        privacy TEXT NOT NULL DEFAULT 'everyone',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS d1_social_posts (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        user_avatar TEXT,
        user_blood_group TEXT,
        category TEXT NOT NULL,
        post_type TEXT NOT NULL DEFAULT 'general',
        title TEXT,
        content TEXT NOT NULL,
        media_urls_json TEXT DEFAULT '[]',
        media_r2_keys_json TEXT DEFAULT '[]',
        donation_meta_json TEXT,
        emergency_meta_json TEXT,
        reactions_json TEXT DEFAULT '{"support":0,"lifesaver":0,"respect":0,"hero":0,"congratulations":0}',
        comments_json TEXT DEFAULT '[]',
        privacy TEXT NOT NULL DEFAULT 'everyone',
        priority INTEGER NOT NULL DEFAULT 7,
        is_verified_institution INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS d1_sync_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        payload TEXT,
        synced_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(3, 'cloudflare_d1_and_r2');
    console.log('[DB] Applied migration 3: cloudflare_d1_and_r2');
  }

  // Migration 4: Cloudflare D1 Database Instances Configuration & Management
  if (!applied.has(4)) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS d1_database_instances (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        database_id TEXT NOT NULL,
        account_id TEXT NOT NULL,
        api_token TEXT NOT NULL,
        binding_name TEXT NOT NULL DEFAULT 'DB',
        region TEXT NOT NULL DEFAULT 'APAC (Singapore)',
        environment TEXT NOT NULL DEFAULT 'production',
        replication_mode TEXT NOT NULL DEFAULT 'primary',
        is_primary INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        read_latency_ms REAL NOT NULL DEFAULT 1.8,
        write_latency_ms REAL NOT NULL DEFAULT 4.2,
        storage_bytes INTEGER NOT NULL DEFAULT 3480000,
        tables_count INTEGER NOT NULL DEFAULT 14,
        last_ping_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_synced_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT OR IGNORE INTO d1_database_instances (
        id, name, database_id, account_id, api_token, binding_name, region,
        environment, replication_mode, is_primary, status, read_latency_ms,
        write_latency_ms, storage_bytes, tables_count, last_ping_at
      ) VALUES 
      (
        'd1-prod-primary',
        'barishal-Blood-prod-d1',
        '9f1a23b4-56c7-88d9-0e1f-23456789abcd',
        'c7a8b9e0123456789abcdef012345678',
        'cf_d1_sec_99a812bfa4c58e19d70034a1',
        'DB',
        'APAC / Singapore (SIN - Edge)',
        'production',
        'primary',
        1,
        'active',
        1.8,
        4.2,
        3480000,
        14,
        datetime('now')
      ),
      (
        'd1-edge-replica-apac',
        'barishal-Blood-edge-replica',
        'b4c89012-34ef-56a7-8901-cdef01234567',
        'c7a8b9e0123456789abcdef012345678',
        'cf_d1_sec_99a812bfa4c58e19d70034a1',
        'DB_REPLICA',
        'South Asia / Dhaka (DAC - Local Edge)',
        'production',
        'read_replica',
        0,
        'active',
        0.9,
        5.1,
        3480000,
        14,
        datetime('now')
      ),
      (
        'd1-staging-test',
        'barishal-Blood-staging-d1',
        '33d45ef6-78ab-90cd-ef12-34567890abcd',
        'c7a8b9e0123456789abcdef012345678',
        'cf_d1_sec_test_staging_token_mock',
        'DB_STAGING',
        'Western Europe / Frankfurt (FRA)',
        'staging',
        'standby',
        0,
        'standby',
        3.4,
        6.8,
        1220000,
        14,
        datetime('now')
      );
    `);

    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(4, 'cloudflare_d1_instances');
    console.log('[DB] Applied migration 4: cloudflare_d1_instances');
  }

  // Migration 5: Admin Username Support, System Config, and Strict Action Records
  if (!applied.has(5)) {
    // Add username column to users if missing
    try {
      const userCols = db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
      const hasUsername = userCols.some((c) => c.name === 'username');
      if (!hasUsername) {
        db.exec("ALTER TABLE users ADD COLUMN username TEXT;");
      }
      db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);");
    } catch (e) {
      console.warn('[DB] Username column migration notice:', e);
    }

    // Set initial default admin usernames if not already set
    db.prepare("UPDATE users SET username = 'superadmin' WHERE id = 1 AND (username IS NULL OR username = '')").run();
    db.prepare("UPDATE users SET username = 'admin' WHERE id = 2 AND (username IS NULL OR username = '')").run();

    // Create system config table for first-time admin setup and emergency flags
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      -- User Warnings Table for Disciplinary Actions
      CREATE TABLE IF NOT EXISTS user_warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        admin_id INTEGER NOT NULL,
        warning_level TEXT NOT NULL DEFAULT 'moderate', -- 'mild', 'moderate', 'strict'
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        acknowledged INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Blacklist & Banned Records Table
      CREATE TABLE IF NOT EXISTS blacklist_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT,
        user_id INTEGER,
        reason TEXT NOT NULL,
        admin_id INTEGER,
        banned_at TEXT NOT NULL DEFAULT (datetime('now')),
        is_active INTEGER NOT NULL DEFAULT 1
      );
    `);

    // Initialize system config defaults
    const insertConfig = db.prepare(`
      INSERT OR IGNORE INTO admin_system_config (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
    `);
    insertConfig.run('first_setup_completed', '0');
    insertConfig.run('emergency_broadcast_active', '0');
    insertConfig.run('emergency_broadcast_message', '');
    insertConfig.run('emergency_broadcast_level', 'critical');
    insertConfig.run('maintenance_mode', '0');

    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(5, 'admin_system_config_and_strict_actions');
    console.log('[DB] Applied migration 5: admin_system_config_and_strict_actions');
  }

  console.log('[DB] All migrations applied successfully.');
}
