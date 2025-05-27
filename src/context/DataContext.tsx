import React, { createContext, useContext, useState } from 'react';
import { PlantingData } from '../services/excelService';

interface DataContextType {
  plantingData: PlantingData[];
  setPlantingData: (data: PlantingData[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plantingData, setPlantingData] = useState<PlantingData[]>([]);

  return (
    <DataContext.Provider value={{ plantingData, setPlantingData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};