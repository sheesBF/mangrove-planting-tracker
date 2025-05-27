import { supabase } from './supabaseClient';

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('phase1_monthly_data')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export default testConnection;