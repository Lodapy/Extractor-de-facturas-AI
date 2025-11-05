
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  progress: {
    current: number;
    total: number;
  };
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress }) => {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <span className="text-lg font-medium text-blue-900">
          Procesando factura {progress.current} de {progress.total}...
        </span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProcessingStatus;
