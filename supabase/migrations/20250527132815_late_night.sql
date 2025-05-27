/*
  # Create base tables for project tracking
  
  1. New Tables
    - `projects` - Stores project information
      - `id` (uuid, primary key)
      - `name` (text, not null)
    - `phases` - Stores phase information
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `phase_number` (integer, not null)
  
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

-- Insert initial data
INSERT INTO projects (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'MozBlue Project 1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO phases (id, project_id, phase_number)
VALUES 
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 3)
ON CONFLICT (id) DO NOTHING;