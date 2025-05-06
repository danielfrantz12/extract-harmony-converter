
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileUp } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  acceptedTypes: string[];
  isProcessing: boolean;
}

const FileUploader = ({ onFileSelected, acceptedTypes, isProcessing }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file type is accepted
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!acceptedTypes.includes(`.${fileExtension}`)) {
      toast({
        title: "Formato não suportado",
        description: `Por favor, selecione um arquivo com extensão: ${acceptedTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
    
    toast({
      title: "Arquivo selecionado",
      description: `${file.name} foi selecionado com sucesso!`
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card 
        className={`border-2 border-dashed p-6 text-center ${
          isDragging 
            ? "border-bank-light bg-blue-50" 
            : "border-gray-300 hover:border-bank-light"
        } transition-all duration-200 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isProcessing ? triggerFileInput : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={acceptedTypes.join(',')}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Upload className="h-7 w-7 text-bank-dark" />
          </div>
          
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium">Arquivo selecionado:</p>
              <p className="text-lg font-semibold text-bank-dark">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-bank-dark">
                Arraste e solte o extrato bancário
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ou clique para selecionar um arquivo
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Formatos aceitos: {acceptedTypes.join(', ')}
              </p>
            </div>
          )}
          
          {selectedFile && !isProcessing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
            >
              Escolher outro arquivo
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileUploader;
