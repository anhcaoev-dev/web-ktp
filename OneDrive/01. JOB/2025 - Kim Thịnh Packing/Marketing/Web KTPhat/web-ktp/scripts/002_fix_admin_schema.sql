-- Drop old admin_users table if exists
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create proper admin_users table with email and password
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (allow anyone to read for login purposes, only admins can write)
CREATE POLICY "admin_users_select_public" ON admin_users FOR SELECT USING (TRUE);

-- RLS Policies for admin_sessions
CREATE POLICY "admin_sessions_insert_public" ON admin_sessions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "admin_sessions_select_public" ON admin_sessions FOR SELECT USING (TRUE);
CREATE POLICY "admin_sessions_delete_public" ON admin_sessions FOR DELETE USING (TRUE);
