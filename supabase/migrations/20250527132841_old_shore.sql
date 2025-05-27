/*
  # Populate monthly data tables
  
  1. Data Population
    - Insert planned trees and hectares data for each phase
    - Data spans from November 2024 to December 2026
    
  2. Monthly Targets
    Phase 1:
    - 400 trees/month
    - 0.35 hectares/month
    
    Phase 2:
    - 500 trees/month
    - 0.42 hectares/month
    
    Phase 3:
    - 350 trees/month
    - 0.28 hectares/month
*/

DO $$
DECLARE
  v_date date;
BEGIN
  -- Generate dates from Nov 2024 to Dec 2026
  FOR v_date IN 
    SELECT generate_series(
      '2024-11-01'::date,
      '2026-12-01'::date,
      '1 month'::interval
    )::date
  LOOP
    -- Insert data for Phase 1
    INSERT INTO phase1_monthly_data (month, planned_trees, planned_hectares)
    VALUES (v_date, 400, 0.35)
    ON CONFLICT (month) 
    DO UPDATE SET
      planned_trees = EXCLUDED.planned_trees,
      planned_hectares = EXCLUDED.planned_hectares;
    
    -- Insert data for Phase 2
    INSERT INTO phase2_monthly_data (month, planned_trees, planned_hectares)
    VALUES (v_date, 500, 0.42)
    ON CONFLICT (month) 
    DO UPDATE SET
      planned_trees = EXCLUDED.planned_trees,
      planned_hectares = EXCLUDED.planned_hectares;
    
    -- Insert data for Phase 3
    INSERT INTO phase3_monthly_data (month, planned_trees, planned_hectares)
    VALUES (v_date, 350, 0.28)
    ON CONFLICT (month) 
    DO UPDATE SET
      planned_trees = EXCLUDED.planned_trees,
      planned_hectares = EXCLUDED.planned_hectares;
  END LOOP;
END $$;