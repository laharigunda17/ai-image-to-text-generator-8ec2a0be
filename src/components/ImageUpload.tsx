import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [disabled, processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden shadow-card border border-border bg-card">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-[500px] object-contain"
          />
          {!disabled && (
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-destructive transition-colors shadow-lg"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragging 
              ? 'border-primary bg-primary/10 scale-[1.02]' 
              : 'border-border hover:border-primary/50 hover:bg-card/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-6 rounded-full transition-all duration-300
              ${isDragging 
                ? 'gradient-primary shadow-glow' 
                : 'bg-card border border-border'
              }
            `}>
              <Upload className="w-12 h-12" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">
                {isDragging ? 'Drop your image here' : 'Upload an image'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse (max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
