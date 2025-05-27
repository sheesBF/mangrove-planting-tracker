/*
  # Update species data tables with monthly data

  This migration creates and populates species-wise data tables for each phase
  with monthly data from November 2024 to December 2026 (inclusive).

  1. Tables Created:
    - phase1_species_data
    - phase2_species_data
    - phase3_species_data

  2. Data Structure:
    - Monthly records for each species
    - Planned and actual trees per species
    - Unique constraint on month + species combination

  3. Security:
    - RLS enabled on all tables
    - Read access for authenticated users
*/

-- Drop existing species data tables
DROP TABLE IF EXISTS phase1_species_data;
DROP TABLE IF EXISTS phase2_species_data;
DROP TABLE IF EXISTS phase3_species_data;

-- Phase 1 Species Data
CREATE TABLE IF NOT EXISTS phase1_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase1_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase1_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 2 Species Data
CREATE TABLE IF NOT EXISTS phase2_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase2_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase2_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Phase 3 Species Data
CREATE TABLE IF NOT EXISTS phase3_species_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL,
  species_name text NOT NULL,
  planned_trees integer NOT NULL DEFAULT 0,
  actual_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phase3_species_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users"
  ON phase3_species_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Add composite unique constraints
ALTER TABLE phase1_species_data ADD CONSTRAINT phase1_species_data_month_species_key UNIQUE (month, species_name);
ALTER TABLE phase2_species_data ADD CONSTRAINT phase2_species_data_month_species_key UNIQUE (month, species_name);
ALTER TABLE phase3_species_data ADD CONSTRAINT phase3_species_data_month_species_key UNIQUE (month, species_name);

-- Generate dates and insert data for Phase 1
DO $$
DECLARE
    curr_month date := '2024-11-01'::date;
    end_month date := '2026-12-31'::date;
    species text;
BEGIN
    FOREACH species IN ARRAY ARRAY['Ceriops tagal', 'Rhizophora mucronata', 'Avicennia marina', 'Bruguiera gymnorrhiza']
    LOOP
        WHILE curr_month <= end_month LOOP
            INSERT INTO phase1_species_data (month, species_name, planned_trees)
            VALUES (
                curr_month,
                species,
                CASE species
                    WHEN 'Ceriops tagal' THEN 125
                    WHEN 'Rhizophora mucronata' THEN 125
                    WHEN 'Avicennia marina' THEN 75
                    WHEN 'Bruguiera gymnorrhiza' THEN 75
                END
            ) ON CONFLICT (month, species_name) DO UPDATE 
            SET planned_trees = EXCLUDED.planned_trees;
            
            curr_month := curr_month + interval '1 month';
        END LOOP;
        curr_month := '2024-11-01'::date;
    END LOOP;
END $$;

-- Generate dates and insert data for Phase 2
DO $$
DECLARE
    curr_month date := '2024-11-01'::date;
    end_month date := '2026-12-31'::date;
    species text;
BEGIN
    FOREACH species IN ARRAY ARRAY['Ceriops tagal', 'Rhizophora mucronata', 'Avicennia marina', 'Bruguiera gymnorrhiza']
    LOOP
        WHILE curr_month <= end_month LOOP
            INSERT INTO phase2_species_data (month, species_name, planned_trees)
            VALUES (
                curr_month,
                species,
                CASE species
                    WHEN 'Ceriops tagal' THEN 125
                    WHEN 'Rhizophora mucronata' THEN 175
                    WHEN 'Avicennia marina' THEN 125
                    WHEN 'Bruguiera gymnorrhiza' THEN 75
                END
            ) ON CONFLICT (month, species_name) DO UPDATE 
            SET planned_trees = EXCLUDED.planned_trees;
            
            curr_month := curr_month + interval '1 month';
        END LOOP;
        curr_month := '2024-11-01'::date;
    END LOOP;
END $$;

-- Generate dates and insert data for Phase 3
DO $$
DECLARE
    curr_month date := '2024-11-01'::date;
    end_month date := '2026-12-31'::date;
    species text;
BEGIN
    FOREACH species IN ARRAY ARRAY['Ceriops tagal', 'Rhizophora mucronata', 'Avicennia marina', 'Bruguiera gymnorrhiza']
    LOOP
        WHILE curr_month <= end_month LOOP
            INSERT INTO phase3_species_data (month, species_name, planned_trees)
            VALUES (
                curr_month,
                species,
                CASE species
                    WHEN 'Ceriops tagal' THEN 100
                    WHEN 'Rhizophora mucronata' THEN 100
                    WHEN 'Avicennia marina' THEN 75
                    WHEN 'Bruguiera gymnorrhiza' THEN 75
                END
            ) ON CONFLICT (month, species_name) DO UPDATE 
            SET planned_trees = EXCLUDED.planned_trees;
            
            curr_month := curr_month + interval '1 month';
        END LOOP;
        curr_month := '2024-11-01'::date;
    END LOOP;
END $$;