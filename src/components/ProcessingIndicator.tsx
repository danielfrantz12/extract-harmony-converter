
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  fileName: string;
}

const ProcessingIndicator = ({ isProcessing, fileName }: ProcessingIndicatorProps) => {
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          // Slowly increase to 90%, then wait for actual completion
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);
      
      return () => clearInterval(timer);
    } else {
      // Complete the progress bar when processing is done
      setProgress(100);
    }
  }, [isProcessing]);

  if (!isProcessing && progress === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin text-bank-light" />
        ) : (
          <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
        )}
        <span className="font-medium text-sm">
          {isProcessing ? "Processando arquivo..." : "Processamento concluído!"}
        </span>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{fileName}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        {isProcessing && (
          <p className="text-xs text-gray-500 animate-pulse-slow">
            Convertendo dados do formato original para o padrão...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProcessingIndicator;
