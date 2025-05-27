/*
  # Add planting plan data

  1. Data Population
    - Add planting plan data for three phases
    - Time period: November 2024 to December 2026
    - Data includes:
      - Trees planned per month
      - Hectares planned per month
    
  2. Project Structure
    - Project 1 with three phases
    - Each phase has monthly targets
*/

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

-- Function to generate monthly data
DO $$ 
DECLARE
  current_date DATE;
  phase_record RECORD;
  trees_per_month INTEGER;
  hectares_per_month NUMERIC(10,2);
BEGIN
  -- Loop through each phase
  FOR phase_record IN SELECT * FROM phases WHERE project_id = '11111111-1111-1111-1111-111111111111'
  LOOP
    -- Set different targets for each phase
    CASE phase_record.phase_number
      WHEN 1 THEN 
        trees_per_month := 400;
        hectares_per_month := 0.35;
      WHEN 2 THEN
        trees_per_month := 500;
        hectares_per_month := 0.42;
      WHEN 3 THEN
        trees_per_month := 350;
        hectares_per_month := 0.28;
    END CASE;

    -- Generate data for each month from Nov 2024 to Dec 2026
    current_date := '2024-11-01'::DATE;
    WHILE current_date <= '2026-12-31'::DATE LOOP
      INSERT INTO monthly_data (
        project_id,
        phase_id,
        month,
        planned_trees,
        planned_hectares
      ) VALUES (
        '11111111-1111-1111-1111-111111111111',
        phase_record.id,
        current_date,
        trees_per_month,
        hectares_per_month
      ) ON CONFLICT (project_id, phase_id, month) 
        DO UPDATE SET 
          planned_trees = EXCLUDED.planned_trees,
          planned_hectares = EXCLUDED.planned_hectares;

      current_date := current_date + INTERVAL '1 month';
    END LOOP;
  END LOOP;
END $$;