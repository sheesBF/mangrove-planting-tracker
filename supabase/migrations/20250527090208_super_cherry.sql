/*
  # Create planting data tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    - `phases`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `phase_number` (integer)
      - `created_at` (timestamp)
    - `monthly_data`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `phase_id` (uuid, foreign key)
      - `month` (date)
      - `planned_trees` (integer)
      - `planned_hectares` (decimal)
      - `actual_trees` (integer)
      - `actual_hectares` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON phases
  FOR SELECT
  TO authenticated
  USING (true);

-- Create monthly_data table
CREATE TABLE IF NOT EXISTS monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_id uuid REFERENCES phases(id),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares decimal(10,2),
  actual_trees integer,
  actual_hectares decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON monthly_data
  FOR SELECT
  TO authenticated
  USING (true);