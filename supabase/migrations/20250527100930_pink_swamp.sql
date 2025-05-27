/*
  # Species Data Tables and Initial Data

  1. New Tables
    - phase1_species_data
      - id (uuid, primary key)
      - month (date)
      - species_name (text)
      - planned_trees (integer)
      - actual_trees (integer)
      - created_at (timestamptz)
    - phase2_species_data (same structure as phase1)
    - phase3_species_data (same structure as phase1)

  2. Security
    - Enable RLS on all tables
    - Add read access policies for authenticated users

  3. Data Population
    - Populate planned trees for all phases from Nov 2024 to Dec 2026
    - Four species per phase with different tree counts
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

-- Generate dates and insert data for all phases
DO $$
DECLARE
    d date;
    s text;
BEGIN
    FOR d IN 
        SELECT generate_series(
            '2024-11-01'::date,
            '2026-12-01'::date,
            '1 month'::interval
        )::date
    LOOP
        -- Phase 1
        FOR s IN 
            SELECT unnest(ARRAY[
                'Ceriops tagal',
                'Rhizophora mucronata',
                'Avicennia marina',
                'Bruguiera gymnorrhiza'
            ])
        LOOP
            INSERT INTO phase1_species_data (month, species_name, planned_trees)
            VALUES (
                d,
                s,
                CASE s
                    WHEN 'Ceriops tagal' THEN 125
                    WHEN 'Rhizophora mucronata' THEN 125
                    WHEN 'Avicennia marina' THEN 75
                    WHEN 'Bruguiera gymnorrhiza' THEN 75
                END
            ) ON CONFLICT (month, species_name) DO UPDATE 
            SET planned_trees = EXCLUDED.planned_trees;
        END LOOP;

        -- Phase 2
        FOR s IN 
            SELECT unnest(ARRAY[
                'Ceriops tagal',
                'Rhizophora mucronata',
                'Avicennia marina',
                'Bruguiera gymnorrhiza'
            ])
        LOOP
            INSERT INTO phase2_species_data (month, species_name, planned_trees)
            VALUES (
                d,
                s,
                CASE s
                    WHEN 'Ceriops tagal' THEN 125
                    WHEN 'Rhizophora mucronata' THEN 175
                    WHEN 'Avicennia marina' THEN 125
                    WHEN 'Bruguiera gymnorrhiza' THEN 75
                END
            ) ON CONFLICT (month, species_name) DO UPDATE 
            SET planned_trees = EXCLUDED.planned_trees;
        END LOOP;

        -- Phase 3
        FOR s IN 
            SELECT unnest(ARRAY[
                'Ceriops tagal',
                'Rhizophora mucronata',
                'Avicennia marina',
                'Bruguiera gymnorrhiza'
            ])
        LOOP
            INSERT INTO phase3_species_data (month, species_name, planned_trees)
            VALUES (
                d,
                s,
                CASE s
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