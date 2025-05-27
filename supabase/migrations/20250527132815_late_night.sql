/*
  # Create base tables
  
  1. New Tables
    - `projects` table for storing project information
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    - `phases` table for storing phase information
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `phase_number` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add read policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  phase_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, phase_number)
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phases
  FOR SELECT
  TO authenticated
  USING (true);