/*
  # Create base tables and relationships

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `created_at` (timestamp with time zone)
    - `phases`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `phase_number` (integer, not null)
      - `created_at` (timestamp with time zone)
    - `monthly_data`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `phase_id` (uuid, foreign key to phases)
      - `month` (date, not null)
      - `planned_trees` (integer)
      - `planned_hectares` (numeric)
      - `actual_trees` (integer)
      - `actual_hectares` (numeric)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add read policies for authenticated users
*/

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Add read policy for projects
CREATE POLICY "Allow read access to all users"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create the phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on phases
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- Add read policy for phases
CREATE POLICY "Allow read access to all users"
  ON phases
  FOR SELECT
  TO authenticated
  USING (true);

-- Create the monthly_data table
CREATE TABLE IF NOT EXISTS monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_id uuid REFERENCES phases(id),
  month date NOT NULL,
  planned_trees integer,
  planned_hectares numeric(10,2),
  actual_trees integer,
  actual_hectares numeric(10,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, phase_id, month)
);

-- Enable RLS on monthly_data
ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;

-- Add read policy for monthly_data
CREATE POLICY "Allow read access to all users"
  ON monthly_data
  FOR SELECT
  TO authenticated
  USING (true);