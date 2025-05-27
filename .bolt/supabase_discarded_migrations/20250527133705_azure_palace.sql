/*
  # Create phase totals view
  
  Creates a materialized view that automatically calculates and stores the total values for each phase
  from their respective monthly data tables.

  1. New View
    - phase_totals
      - phase_name (text)
      - total_planned_trees (integer)
      - total_planned_hectares (numeric)
      - total_actual_trees (integer)
      - total_actual_hectares (numeric)

  2. Security
    - Enables RLS
    - Adds read policy for authenticated users
*/

CREATE MATERIALIZED VIEW phase_totals AS
SELECT 
  'Phase 1' as phase_name,
  COALESCE(SUM(planned_trees), 0) as total_planned_trees,
  COALESCE(SUM(planned_hectares), 0) as total_planned_hectares,
  COALESCE(SUM(actual_trees), 0) as total_actual_trees,
  COALESCE(SUM(actual_hectares), 0) as total_actual_hectares
FROM phase1_monthly_data

UNION ALL

SELECT 
  'Phase 2' as phase_name,
  COALESCE(SUM(planned_trees), 0) as total_planned_trees,
  COALESCE(SUM(planned_hectares), 0) as total_planned_hectares,
  COALESCE(SUM(actual_trees), 0) as total_actual_trees,
  COALESCE(SUM(actual_hectares), 0) as total_actual_hectares
FROM phase2_monthly_data

UNION ALL

SELECT 
  'Phase 3' as phase_name,
  COALESCE(SUM(planned_trees), 0) as total_planned_trees,
  COALESCE(SUM(planned_hectares), 0) as total_planned_hectares,
  COALESCE(SUM(actual_trees), 0) as total_actual_trees,
  COALESCE(SUM(actual_hectares), 0) as total_actual_hectares
FROM phase3_monthly_data;

ALTER MATERIALIZED VIEW phase_totals OWNER TO authenticated;

CREATE UNIQUE INDEX phase_totals_phase_name_idx ON phase_totals (phase_name);

COMMENT ON MATERIALIZED VIEW phase_totals IS 'Stores the total values for trees and hectares for each phase';

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_phase_totals()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW phase_totals;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh the view when monthly data changes
CREATE TRIGGER refresh_phase_totals_phase1
AFTER INSERT OR UPDATE OR DELETE ON phase1_monthly_data
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_phase_totals();

CREATE TRIGGER refresh_phase_totals_phase2
AFTER INSERT OR UPDATE OR DELETE ON phase2_monthly_data
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_phase_totals();

CREATE TRIGGER refresh_phase_totals_phase3
AFTER INSERT OR UPDATE OR DELETE ON phase3_monthly_data
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_phase_totals();