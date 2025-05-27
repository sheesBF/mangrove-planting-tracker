import { read, utils } from 'xlsx';

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
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    const plantingData: PlantingData[] = [];
    
    jsonData.forEach((row: any) => {
      const existingProject = plantingData.find(p => p.projectId === row.ProjectId && p.phaseId === row.PhaseId);
      
      if (existingProject) {
        existingProject.species.push({
          name: row.Species,
          trees: parseInt(row.TreesPlanted)
        });
      } else {
        plantingData.push({
          projectId: row.ProjectId,
          phaseId: row.PhaseId,
          totalTrees: parseInt(row.TotalTrees),
          totalHectares: parseFloat(row.TotalHectares),
          species: [{
            name: row.Species,
            trees: parseInt(row.TreesPlanted)
          }]
        });
      }
    });

    return plantingData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process Excel file');
  }
};