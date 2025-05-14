import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import ConverterInfo from "@/components/ConverterInfo";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import { convertBankStatement, getSupportedBanks, approveSuggestions } from "@/lib/converter";
import { Download, Check } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ texto: string; sugestao: string; tipo: string }>>([]);
  const [outputFile, setOutputFile] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setSuggestions([]);
    setOutputFile(null);
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

    if (!selectedBank) {
      toast({
        title: "Nenhum banco selecionado",
        description: "Por favor, selecione o banco do extrato",
        variant: "destructive"
      });
      return;
    }

    if (selectedBank === "C6" && !password) {
      toast({
        title: "Senha não informada",
        description: "Por favor, informe a senha para extratos do banco C6",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await convertBankStatement(selectedFile, selectedBank, password);
      
      if (result.success && result.data) {
        setSuggestions(result.data.suggestions);
        setOutputFile(result.data.outputFile);
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
    if (!outputFile) return;
    
    const downloadLink = document.createElement("a");
    downloadLink.href = `/uploads/${outputFile}`;
    downloadLink.download = outputFile;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo convertido está sendo baixado"
    });
  };

  const handleApprove = async () => {
    if (!suggestions.length) return;

    setIsProcessing(true);
    try {
      await approveSuggestions(suggestions);
      toast({
        title: "Sugestões aprovadas",
        description: "As categorias foram salvas com sucesso!"
      });
      setSuggestions([]);
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao salvar as categorias",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
            Converta extratos bancários e categorize transações automaticamente
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ConverterInfo supportedBanks={supportedBanks} />
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-select">Selecione o Banco</Label>
                <Select
                  value={selectedBank}
                  onValueChange={setSelectedBank}
                >
                  <SelectTrigger id="bank-select" className="w-full">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBank === "C6" && (
                <div>
                  <Label htmlFor="password">Senha (apenas para C6)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha para o extrato do C6"
                  />
                </div>
              )}
              
              <FileUploader 
                onFileSelected={handleFileSelected}
                acceptedTypes={['.xlsx', '.xls', '.csv', '.pdf']}
                isProcessing={isProcessing}
              />
            </div>
            
            <div className="flex justify-center gap-4">
              {outputFile && (
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Arquivo
                </Button>
              )}
              
              {suggestions.length > 0 && (
                <Button 
                  onClick={handleApprove}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar Categorias
                </Button>
              )}
              
              {!outputFile && !suggestions.length && (
                <Button 
                  onClick={handleConvert}
                  disabled={!selectedFile || isProcessing || !selectedBank}
                  className="bg-bank-dark hover:bg-bank-light"
                >
                  Converter Extrato
                </Button>
              )}
            </div>
            
            {(isProcessing || suggestions.length > 0) && selectedFile && (
              <ProcessingIndicator 
                isProcessing={isProcessing}
                fileName={selectedFile.name}
              />
            )}

            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Sugestões de Categorias</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="font-medium">{suggestion.texto}</p>
                      <p className="text-sm text-gray-600">
                        Categoria: <span className="font-medium">{suggestion.sugestao}</span>
                        {suggestion.tipo && (
                          <span className="ml-2">
                            ({suggestion.tipo === 'E' ? 'Entrada' : 'Saída'})
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
