-- Populate Monthly Data for Phase 1
WITH RECURSIVE dates AS (
  SELECT '2024-11-01'::timestamp AS month
  UNION ALL
  SELECT month + interval '1 month'
  FROM dates
  WHERE month <= '2026-12-01'::timestamp
)
INSERT INTO phase1_monthly_data (month, planned_trees, planned_hectares)
SELECT 
  d.month::date,
  400 as planned_trees,
  0.35 as planned_hectares
FROM dates d
ON CONFLICT (month) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees,
  planned_hectares = EXCLUDED.planned_hectares;

-- Populate Monthly Data for Phase 2
WITH RECURSIVE dates AS (
  SELECT '2024-11-01'::timestamp AS month
  UNION ALL
  SELECT month + interval '1 month'
  FROM dates
  WHERE month <= '2026-12-01'::timestamp
)
INSERT INTO phase2_monthly_data (month, planned_trees, planned_hectares)
SELECT 
  d.month::date,
  500 as planned_trees,
  0.42 as planned_hectares
FROM dates d
ON CONFLICT (month) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees,
  planned_hectares = EXCLUDED.planned_hectares;

-- Populate Monthly Data for Phase 3
WITH RECURSIVE dates AS (
  SELECT '2024-11-01'::timestamp AS month
  UNION ALL
  SELECT month + interval '1 month'
  FROM dates
  WHERE month <= '2026-12-01'::timestamp
)
INSERT INTO phase3_monthly_data (month, planned_trees, planned_hectares)
SELECT 
  d.month::date,
  350 as planned_trees,
  0.28 as planned_hectares
FROM dates d
ON CONFLICT (month) 
DO UPDATE SET
  planned_trees = EXCLUDED.planned_trees,
  planned_hectares = EXCLUDED.planned_hectares;

-- Insert Species Data for Phase 1
INSERT INTO phase1_species_data (species_name, trees_planted)
VALUES 
  ('Ceriops tagal', 1500),
  ('Rhizophora mucronata', 1500),
  ('Avicennia marina', 1000),
  ('Bruguiera gymnorrhiza', 1000)
ON CONFLICT (species_name) 
DO UPDATE SET
  trees_planted = EXCLUDED.trees_planted;

-- Insert Species Data for Phase 2
INSERT INTO phase2_species_data (species_name, trees_planted)
VALUES 
  ('Ceriops tagal', 1500),
  ('Rhizophora mucronata', 2000),
  ('Avicennia marina', 1500),
  ('Bruguiera gymnorrhiza', 1000)
ON CONFLICT (species_name) 
DO UPDATE SET
  trees_planted = EXCLUDED.trees_planted;

-- Insert Species Data for Phase 3
INSERT INTO phase3_species_data (species_name, trees_planted)
VALUES 
  ('Ceriops tagal', 1000),
  ('Rhizophora mucronata', 1000),
  ('Avicennia marina', 1000),
  ('Bruguiera gymnorrhiza', 1000)
ON CONFLICT (species_name) 
DO UPDATE SET
  trees_planted = EXCLUDED.trees_planted;