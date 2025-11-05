
import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { ExtractedInvoiceData } from './types';
import { extractDataFromImage } from './services/geminiService';
import { processWithConcurrency } from './utils/concurrency';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import ActionButtons from './components/ActionButtons';
import ProcessingStatus from './components/ProcessingStatus';
import ResultsTable from './components/ResultsTable';
import ImagePreviewModal from './components/ImagePreviewModal';

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processInvoices = useCallback(async () => {
    setIsProcessing(true);
    setExtractedData([]);
    setProgress({ current: 0, total: files.length });

    try {
      // Procesar archivos en paralelo con límite de 3 concurrentes para evitar rate limiting
      const results = await processWithConcurrency(
        files,
        async (file: File) => {
          try {
            const data = await extractDataFromImage(file);
            return { ...data, archivo: file.name };
          } catch (error) {
            console.error('Error processing image:', error);
            return {
              numeroFactura: "Error",
              fecha: "N/D",
              proveedor: "Error al procesar",
              concepto: "N/D",
              importe: "0",
              categoria: "N/D",
              archivo: file.name
            };
          }
        },
        3, // Límite de concurrencia: 3 archivos simultáneos
        (completed, total, result) => {
          // Actualizar progreso y resultados en tiempo real
          setProgress({ current: completed, total });
          setExtractedData(prev => {
            const newData = [...prev];
            newData.push(result);
            return newData;
          });
        }
      );

      // Asegurar que todos los resultados estén en el estado final
      setExtractedData(results);
    } catch (error) {
      console.error('Error during batch processing:', error);
    }

    setIsProcessing(false);
  }, [files]);

  const exportToExcel = () => {
    const sortedData = [...extractedData].sort((a, b) => 
      a.proveedor.localeCompare(b.proveedor)
    );

    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map(item => ({
        'Número de Factura': item.numeroFactura,
        'Fecha': item.fecha,
        'Proveedor': item.proveedor,
        'Concepto': item.concepto,
        'Categoría': item.categoria,
        'Importe': item.importe,
        'Archivo Origen': item.archivo
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas Extraídas');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `datos_facturas_${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <Header />
          <div className="mt-8 space-y-8">
            <FileUpload onFileChange={handleFileChange} />
            
            {files.length > 0 && (
              <FileList files={files} onRemove={handleRemoveFile} onPreview={handlePreview} />
            )}

            <ActionButtons
              fileCount={files.length}
              isProcessing={isProcessing}
              hasData={extractedData.length > 0}
              onProcess={processInvoices}
              onExport={exportToExcel}
            />

            {isProcessing && <ProcessingStatus progress={progress} />}

            {extractedData.length > 0 && !isProcessing && (
              <ResultsTable data={extractedData} />
            )}
          </div>
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Desarrollado con React, Tailwind CSS y Gemini API.</p>
        </footer>
      </div>
      {selectedImage && (
        <ImagePreviewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
