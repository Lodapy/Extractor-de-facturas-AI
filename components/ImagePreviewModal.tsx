
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-white p-2 rounded-lg shadow-2xl max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition-transform transform hover:scale-110"
          aria-label="Cerrar previsualización"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Previsualización de factura"
          className="max-w-full max-h-[90vh] object-contain rounded"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
