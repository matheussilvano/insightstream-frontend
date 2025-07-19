// src/app/page.tsx

"use client"; // Marca este componente para rodar no navegador

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Define a estrutura da nossa resposta da API
interface AnalysisResult {
  sentimento: string;
  topicos: string[];
  sumario: string;
  insight_acionavel: string;
}

export default function HomePage() {
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Por favor, insira um texto para analisar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

    } catch (err) {
      setError("Não foi possível conectar ao servidor de análise. Verifique se o backend está rodando e se o CORS está configurado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função auxiliar para deixar a primeira letra maiúscula
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-slate-800">
              InsightStream AI
            </CardTitle>
            <CardDescription className="text-center">
              Transforme feedback de clientes em insights acionáveis com IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Cole o feedback do seu cliente aqui..."
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="resize-none"
                disabled={isLoading}
              />
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  "Analisar Feedback"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
            <Card className="mt-4 bg-red-100 border-red-400">
                <CardContent className="p-4">
                    <p className="text-center text-red-700 font-medium">{error}</p>
                </CardContent>
            </Card>
        )}

        {analysisResult && (
          <Card className="mt-4 shadow-lg animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-slate-700">Sentimento</h3>
                <p className={`font-bold text-lg ${analysisResult.sentimento === 'positivo' ? 'text-green-600' : 'text-red-600'}`}>
                  {capitalize(analysisResult.sentimento)}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">Tópicos Principais</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysisResult.topicos.map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-slate-200 text-slate-800 text-sm font-medium rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">Sumário</h3>
                <p className="text-slate-600">{analysisResult.sumario}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800">💡 Insight Acionável</h3>
                <p className="text-blue-700 italic">{analysisResult.insight_acionavel}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}