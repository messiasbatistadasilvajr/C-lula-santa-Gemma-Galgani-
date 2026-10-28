import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro não tratado:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReloadApp = () => {
    try {
      // Limpa chaves temporárias corrompidas se houver
      window.location.reload();
    } catch {
      this.handleReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 p-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7B1113] to-[#45090F] text-[#E5C158] flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B1113] font-cinzel">
                Célula Santa Gemma Galgani • Paz & Bem
              </span>
              <h2 className="text-lg font-bold text-[#241E1C] font-cinzel">
                Algo inesperado aconteceu
              </h2>
              <p className="text-xs text-[#70645E] leading-relaxed">
                Não se preocupe! Seus dados e orações continuam salvos e protegidos no aparelho.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE8E0] text-left">
                <p className="text-[10px] font-mono text-red-800 break-words line-clamp-3">
                  {this.state.error.message || 'Erro de renderização temporário'}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Tentar Novamente</span>
              </button>

              <button
                type="button"
                onClick={this.handleReloadApp}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#36070D] border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#7B1113]" />
                <span>Recarregar Início</span>
              </button>
            </div>

            <p className="text-[10px] text-[#8A7C75] italic">
              "Fazei tudo sem murmurações nem hesitações." (Fl 2, 14)
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
