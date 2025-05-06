
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ConverterInfoProps {
  supportedBanks: string[];
}

const ConverterInfo = ({ supportedBanks }: ConverterInfoProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText size={18} className="text-bank-light" />
          Conversor de Extratos
        </CardTitle>
        <CardDescription>
          Converta extratos bancários para o seu formato padrão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-sm text-bank-dark">Bancos suportados:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {supportedBanks.map((bank, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-bank-dark"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-bank-dark">Como usar:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 mt-1 space-y-1">
              <li>Selecione o extrato bancário no formato original (.xlsx, .csv, .pdf)</li>
              <li>Clique em "Converter" para processar o arquivo</li>
              <li>Baixe o arquivo convertido no formato padrão</li>
            </ol>
          </div>
          
          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            <p>
              Este conversor utiliza o seu código Python para transformar os extratos bancários
              no formato padrão que você definiu.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConverterInfo;
