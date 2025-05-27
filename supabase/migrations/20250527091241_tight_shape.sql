/*
  # Initial schema and data setup for planting plan

  1. Tables
    - Creates unique constraint on monthly_data for project_id, phase_id, and month
    - Inserts initial project data for MozBlue
    - Inserts three phases
    - Populates monthly planting plan data from Nov 2024 to Dec 2026

  2. Data
    - Project: MozBlue
    - Phases: 1, 2, and 3
    - Monthly targets:
      - Phase 1: 400 trees (0.8 ha) per month
      - Phase 2: 500 trees (1.0 ha) per month
      - Phase 3: 300 trees (0.6 ha) per month
*/

-- Add unique constraint for monthly data
ALTER TABLE monthly_data 
ADD CONSTRAINT monthly_data_project_phase_month_key 
UNIQUE (project_id, phase_id, month);

-- Insert project if it doesn't exist
INSERT INTO projects (id, name)
VALUES ('d7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 'MozBlue')
ON CONFLICT (id) DO NOTHING;

-- Insert phases if they don't exist
INSERT INTO phases (id, project_id, phase_number)
VALUES 
  ('f1a2b3c4-d5e6-4444-9999-111111111111', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 1),
  ('a1b2c3d4-e5f6-4444-8888-222222222222', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 2),
  ('b1c2d3e4-f5f6-4444-7777-333333333333', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert monthly planting plan data
WITH months AS (
  SELECT generate_series(
    '2024-11-01'::date,
    '2026-12-01'::date,
    interval '1 month'
  )::date as month
)
INSERT INTO monthly_data (project_id, phase_id, month, planned_trees, planned_hectares)
SELECT
  'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d' as project_id,
  phase.id as phase_id,
  m.month,
  CASE 
    WHEN phase.phase_number = 1 THEN 400
    WHEN phase.phase_number = 2 THEN 500
    WHEN phase.phase_number = 3 THEN 300
  END as planned_trees,
  CASE 
    WHEN phase.phase_number = 1 THEN 0.8
    WHEN phase.phase_number = 2 THEN 1.0
    WHEN phase.phase_number = 3 THEN 0.6
  END as planned_hectares
FROM months m
CROSS JOIN (
  SELECT id, phase_number 
  FROM phases 
  WHERE project_id = 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d'
) phase
ON CONFLICT (project_id, phase_id, month) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees,
  planned_hectares = EXCLUDED.planned_hectares;