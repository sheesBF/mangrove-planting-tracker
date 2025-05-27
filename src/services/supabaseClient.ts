import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Query functions for phase data
export const getPhase1Data = async () => {
  const { data, error } = await supabase
    .from('phase1_monthly_data')
    .select('*')
    .order('month');
  
  if (error) {
    console.error('Error fetching phase 1 data:', error);
    throw error;
  }
  
  return data;
};

export const getPhase1Species = async () => {
  const { data, error } = await supabase
    .from('phase1_species_data')
    .select('*')
    .order('species_name');
  
  if (error) {
    console.error('Error fetching phase 1 species:', error);
    throw error;
  }
  
  return data;
};

export const getPhase2Data = async () => {
  const { data, error } = await supabase
    .from('phase2_monthly_data')
    .select('*')
    .order('month');
  
  if (error) {
    console.error('Error fetching phase 2 data:', error);
    throw error;
  }
  
  return data;
};

export const getPhase2Species = async () => {
  const { data, error } = await supabase
    .from('phase2_species_data')
    .select('*')
    .order('species_name');
  
  if (error) {
    console.error('Error fetching phase 2 species:', error);
    throw error;
  }
  
  return data;
};