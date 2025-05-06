
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import ConverterInfo from "@/components/ConverterInfo";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import { convertBankStatement, getSupportedBanks } from "@/lib/converter";
import { Download } from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setConvertedFile(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de extrato bancário para converter",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await convertBankStatement(selectedFile);
      
      if (result.success && result.data) {
        setConvertedFile(result.data);
        toast({
          title: "Conversão concluída",
          description: "Seu extrato foi convertido com sucesso!"
        });
      } else {
        toast({
          title: "Erro na conversão",
          description: result.errorMessage || "Ocorreu um erro ao converter o arquivo",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar o arquivo",
        variant: "destructive"
      });
      console.error("Conversion error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(convertedFile);
    
    downloadLink.href = url;
    downloadLink.download = `${selectedFile?.name.split('.')[0]}_convertido.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo convertido está sendo baixado"
    });
  };

  const supportedBanks = getSupportedBanks();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-bank-dark mb-2">
            Conversor de Extratos Bancários
          </h1>
          <p className="text-gray-600">
            Converta extratos bancários para o seu formato personalizado
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ConverterInfo supportedBanks={supportedBanks} />
          
          <div className="space-y-6">
            <FileUploader 
              onFileSelected={handleFileSelected}
              acceptedTypes={['.xlsx', '.xls', '.csv', '.pdf']}
              isProcessing={isProcessing}
            />
            
            <div className="flex justify-center">
              {convertedFile ? (
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Arquivo Convertido
                </Button>
              ) : (
                <Button 
                  onClick={handleConvert}
                  disabled={!selectedFile || isProcessing}
                  className="bg-bank-dark hover:bg-bank-light"
                >
                  Converter Extrato
                </Button>
              )}
            </div>
            
            {(isProcessing || convertedFile) && selectedFile && (
              <ProcessingIndicator 
                isProcessing={isProcessing}
                fileName={selectedFile.name}
              />
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Esta é uma simulação da interface. Para implementar completamente, 
            você precisará conectar seu código Python ao backend.
          </p>
          <p className="mt-2">
            <a 
              href="#" 
              className="text-bank-light hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "Informação",
                  description: "Na implementação completa, este link pode redirecionar para documentação ou ajuda."
                });
              }}
            >
              Saiba mais sobre a integração
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
