/*
  # Populate species data tables
  
  1. Data Population
    - Insert planned trees data for each species in each phase
    - Data spans from November 2024 to December 2026
    
  2. Species Distribution
    Phase 1:
    - Ceriops tagal: 125 trees/month
    - Rhizophora mucronata: 125 trees/month
    - Avicennia marina: 75 trees/month
    - Bruguiera gymnorrhiza: 75 trees/month
    
    Phase 2:
    - Ceriops tagal: 125 trees/month
    - Rhizophora mucronata: 175 trees/month
    - Avicennia marina: 125 trees/month
    - Bruguiera gymnorrhiza: 75 trees/month
    
    Phase 3:
    - Ceriops tagal: 100 trees/month
    - Rhizophora mucronata: 100 trees/month
    - Avicennia marina: 75 trees/month
    - Bruguiera gymnorrhiza: 75 trees/month
*/

DO $$
DECLARE
  v_date date;
  v_species text;
BEGIN
  -- Generate dates from Nov 2024 to Dec 2026
  FOR v_date IN 
    SELECT generate_series(
      '2024-11-01'::date,
      '2026-12-01'::date,
      '1 month'::interval
    )::date
  LOOP
    -- Insert data for each species in Phase 1
    FOR v_species IN 
      SELECT unnest(ARRAY[
        'Ceriops tagal',
        'Rhizophora mucronata',
        'Avicennia marina',
        'Bruguiera gymnorrhiza'
      ])
    LOOP
      INSERT INTO phase1_species_data (month, species_name, planned_trees)
      VALUES (
        v_date,
        v_species,
        CASE v_species
          WHEN 'Ceriops tagal' THEN 125
          WHEN 'Rhizophora mucronata' THEN 125
          WHEN 'Avicennia marina' THEN 75
          WHEN 'Bruguiera gymnorrhiza' THEN 75
        END
      ) ON CONFLICT (month, species_name) DO UPDATE 
      SET planned_trees = EXCLUDED.planned_trees;
      
      -- Insert data for Phase 2
      INSERT INTO phase2_species_data (month, species_name, planned_trees)
      VALUES (
        v_date,
        v_species,
        CASE v_species
          WHEN 'Ceriops tagal' THEN 125
          WHEN 'Rhizophora mucronata' THEN 175
          WHEN 'Avicennia marina' THEN 125
          WHEN 'Bruguiera gymnorrhiza' THEN 75
        END
      ) ON CONFLICT (month, species_name) DO UPDATE 
      SET planned_trees = EXCLUDED.planned_trees;
      
      -- Insert data for Phase 3
      INSERT INTO phase3_species_data (month, species_name, planned_trees)
      VALUES (
        v_date,
        v_species,
        CASE v_species
          WHEN 'Ceriops tagal' THEN 100
          WHEN 'Rhizophora mucronata' THEN 100
          WHEN 'Avicennia marina' THEN 75
          WHEN 'Bruguiera gymnorrhiza' THEN 75
        END
      ) ON CONFLICT (month, species_name) DO UPDATE 
      SET planned_trees = EXCLUDED.planned_trees;
    END LOOP;
  END LOOP;
END $$;