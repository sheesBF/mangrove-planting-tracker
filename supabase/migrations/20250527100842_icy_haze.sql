-- Insert project if not exists
INSERT INTO projects (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'MozBlue Project 1')
ON CONFLICT (id) DO NOTHING;

-- Insert phases if not exist
INSERT INTO phases (id, project_id, phase_number)
VALUES 
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert monthly planting plan data
WITH RECURSIVE dates AS (
  SELECT '2024-11-01'::timestamp AS month
  UNION ALL
  SELECT month + interval '1 month'
  FROM dates
  WHERE month <= '2026-12-01'::timestamp
),
phase_targets AS (
  SELECT 
    id as phase_id,
    phase_number,
    CASE phase_number
      WHEN 1 THEN 400
      WHEN 2 THEN 500
      WHEN 3 THEN 350
    END as trees_per_month,
    CASE phase_number
      WHEN 1 THEN 0.35
      WHEN 2 THEN 0.42
      WHEN 3 THEN 0.28
    END as hectares_per_month
  FROM phases
  WHERE project_id = '11111111-1111-1111-1111-111111111111'
)
INSERT INTO monthly_data (
  project_id,
  phase_id,
  month,
  planned_trees,
  planned_hectares
)
SELECT 
  '11111111-1111-1111-1111-111111111111' as project_id,
  pt.phase_id,
  d.month::date,
  pt.trees_per_month,
  pt.hectares_per_month
FROM dates d
CROSS JOIN phase_targets pt
ON CONFLICT (project_id, phase_id, month) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees,
  planned_hectares = EXCLUDED.planned_hectares;