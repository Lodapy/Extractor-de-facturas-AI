
import React from 'react';
import { X, Eye } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onPreview: (file: File) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, onPreview }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Archivos cargados ({files.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-72 overflow-y-auto p-2 bg-slate-50 rounded-lg">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative group border border-gray-200 rounded-lg p-2 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="absolute top-1.5 right-1.5 z-10 flex space-x-1">
                <button
                  onClick={() => onPreview(file)}
                  className="bg-blue-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Preview file"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemove(index)}
                  className="bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
            </div>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-24 object-cover rounded-md mb-2"
            />
            <p className="text-xs text-gray-600 break-all w-full px-1">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
