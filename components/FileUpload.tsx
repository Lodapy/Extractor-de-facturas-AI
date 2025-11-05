
import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  return (
    <div>
      <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 text-gray-400 mb-3" />
          <p className="mb-2 text-lg font-semibold text-gray-700">
            Haz clic o arrastra las imágenes aquí
          </p>
          <p className="text-sm text-gray-500">
            Formatos soportados: PNG, JPG, JPEG, WEBP
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={onFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
