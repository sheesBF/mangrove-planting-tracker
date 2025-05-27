import { supabase } from './supabaseClient';

export interface PlantingData {
  projectId: number;
  phaseId: number;
  totalTrees: number;
  totalHectares: number;
  species: {
    name: string;
    trees: number;
  }[];
}

export const processExcelFile = async (file: File): Promise<PlantingData[]> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-excel`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to process Excel file');
    }

    // Fetch the processed data from Supabase
    const { data: monthlyData, error } = await supabase
      .from('monthly_data')
      .select(`
        id,
        project_id,
        phase_id,
        month,
        planned_trees,
        planned_hectares,
        actual_trees,
        actual_hectares
      `);

    if (error) {
      throw error;
    }

    return monthlyData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process Excel file');
  }
};