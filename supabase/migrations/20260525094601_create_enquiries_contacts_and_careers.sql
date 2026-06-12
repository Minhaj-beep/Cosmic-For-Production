/*
  # Dealer Enquiries, Contact Submissions, Vacancies, and Applications Schema

  1. New Tables
    - `dealer_enquiries` — Dealership enquiry form submissions
      - `id`, `name`, `company`, `email`, `phone`, `city`, `state`, `message`
      - `status` (enum: new/in_progress/resolved), `notes`, `created_at`, `updated_at`
    - `contact_submissions` — General contact form submissions
      - `id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`
    - `vacancies` — Job openings posted by admin
      - `id`, `title`, `department`, `location`, `experience`, `type`, `description`
      - `requirements` (text[]), `status` (enum: active/closed/draft)
      - `created_at`, `updated_at`
    - `applications` — Job applications from candidates
      - `id`, `vacancy_id` (FK), `name`, `email`, `phone`, `experience`
      - `cover_letter`, `resume_url`, `status`, `notes`, `applied_at`

  2. Security
    - RLS on all tables
    - Public (anon) can INSERT into dealer_enquiries, contact_submissions, applications
    - Authenticated admins can read all and update status/notes
    - Applicants cannot read other applicants' data (no SELECT for anon on applications)

  3. Notes
    - requirements stored as text array
    - Email notifications triggered via Edge Function
*/

-- Dealer enquiries
CREATE TABLE IF NOT EXISTS dealer_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dealer_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit dealer enquiry"
  ON dealer_enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read all dealer enquiries"
  ON dealer_enquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update dealer enquiries"
  ON dealer_enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete dealer enquiries"
  ON dealer_enquiries FOR DELETE
  TO authenticated
  USING (true);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Vacancies
CREATE TABLE IF NOT EXISTS vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text DEFAULT '',
  location text DEFAULT '',
  experience text DEFAULT '',
  type text NOT NULL DEFAULT 'full_time' CHECK (type IN ('full_time', 'part_time', 'contract')),
  description text DEFAULT '',
  requirements text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'closed', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active vacancies"
  ON vacancies FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated can read all vacancies"
  ON vacancies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert vacancies"
  ON vacancies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update vacancies"
  ON vacancies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete vacancies"
  ON vacancies FOR DELETE
  TO authenticated
  USING (true);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id uuid REFERENCES vacancies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  experience text DEFAULT '',
  cover_letter text DEFAULT '',
  resume_url text DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'shortlisted', 'interviewed', 'rejected', 'hired')),
  notes text DEFAULT '',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete applications"
  ON applications FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_status ON dealer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON vacancies(status);
