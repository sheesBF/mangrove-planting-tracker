/*
  # Insert planting plan data

  1. Data Population
    - Inserts planting plan data for all three phases
    - Covers period from November 2024 to December 2026
    - Includes both trees and hectares data
    
  2. Structure
    - Project data for "MozBlue"
    - Three phases with their respective planting plans
    - Monthly planned values for trees and hectares
*/

-- Insert project if it doesn't exist
INSERT INTO projects (id, name)
VALUES ('d7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 'MozBlue')
ON CONFLICT (id) DO NOTHING;

-- Insert phases if they don't exist
INSERT INTO phases (id, project_id, phase_number)
VALUES 
  ('f1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 1),
  ('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 2),
  ('b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6', 'd7b5d3c9-1b4a-4c1e-9c6f-8d2f9e3b5a4d', 3)
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