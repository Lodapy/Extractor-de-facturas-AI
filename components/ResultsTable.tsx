
import React from 'react';
import type { ExtractedInvoiceData } from '../types';

interface ResultsTableProps {
  data: ExtractedInvoiceData[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Resultados de la Extracción
      </h3>
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full min-w-max text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">N° Factura</th>
              <th scope="col" className="px-6 py-3 font-semibold">Fecha</th>
              <th scope="col" className="px-6 py-3 font-semibold">Proveedor</th>
              <th scope="col" className="px-6 py-3 font-semibold">Concepto</th>
              <th scope="col" className="px-6 py-3 font-semibold">Categoría</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Importe</th>
              <th scope="col" className="px-6 py-3 font-semibold">Archivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.numeroFactura}</td>
                <td className="px-6 py-4">{item.fecha}</td>
                <td className="px-6 py-4">{item.proveedor}</td>
                <td className="px-6 py-4">{item.concepto}</td>
                <td className="px-6 py-4">{item.categoria}</td>
                <td className="px-6 py-4 font-mono text-right text-gray-900">{item.importe}</td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{item.archivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;