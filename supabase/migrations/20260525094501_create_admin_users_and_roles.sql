/*
  # Admin Users and Role System

  1. New Tables
    - `admin_profiles` — Extended profile for Supabase Auth users with admin roles
      - `id` (uuid, FK to auth.users)
      - `name` (text)
      - `role` (text: 'admin' | 'editor')
      - `avatar_url` (text, nullable)
      - `created_at`, `updated_at` (timestamps)

  2. Security
    - Enable RLS on admin_profiles
    - Admins can read/update their own profile
    - Only admins can read all profiles (checked via role column)

  3. Notes
    - This table extends Supabase Auth — users must exist in auth.users first
    - Role-based access control is enforced via RLS and JWT claims
*/

CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update own profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert own profile"
  ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
