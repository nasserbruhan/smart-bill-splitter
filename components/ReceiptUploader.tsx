
import React, { useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';

interface Props {
  onImageCaptured: (base64: string) => void;
  isLoading: boolean;
}

const ReceiptUploader: React.FC<Props> = ({ onImageCaptured, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCaptured(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200 space-y-4">
      <div className="bg-indigo-50 p-4 rounded-full">
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        ) : (
          <Camera className="w-12 h-12 text-indigo-600" />
        )}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {isLoading ? "Analyzing Receipt..." : "Snap your receipt"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? "Hold tight, our AI is doing the math" : "Take a photo or upload an image"}
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs mt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Camera size={20} />
          <span>Camera</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Upload size={20} />
          <span>Upload</span>
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ReceiptUploader;
