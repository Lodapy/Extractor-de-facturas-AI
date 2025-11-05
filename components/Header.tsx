
import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-xl">
            <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Extractor de Datos de Facturas
            </h1>
            <p className="text-gray-600 mt-1">
              Sube imágenes de facturas y extrae la información a Excel con la ayuda de IA.
            </p>
        </div>
      </div>
    </>
  );
};

export default Header;
