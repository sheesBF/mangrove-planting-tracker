import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { processExcelFile } from '../services/excelService';

interface FileUploadProps {
  onDataLoaded: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await processExcelFile(file);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error processing file. Please check the format and try again.');
    }
  }, [onDataLoaded]);

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-400/30 border-dashed rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-emerald-400" />
          <p className="mb-2 text-sm text-emerald-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-emerald-400/70">Excel files only</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default FileUpload;