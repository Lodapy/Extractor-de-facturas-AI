
import React from 'react';
import { FileText, Download } from 'lucide-react';

interface ActionButtonsProps {
  fileCount: number;
  isProcessing: boolean;
  hasData: boolean;
  onProcess: () => void;
  onExport: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ fileCount, isProcessing, hasData, onProcess, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {fileCount > 0 && (
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <FileText className="w-5 h-5" />
          Extraer Datos de {fileCount} Factura{fileCount > 1 ? 's' : ''}
        </button>
      )}
      {hasData && !isProcessing &&(
        <button
          onClick={onExport}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exportar a Excel
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
