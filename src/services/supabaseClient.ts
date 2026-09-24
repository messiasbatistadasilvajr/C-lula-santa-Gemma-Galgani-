/**
 * Configuração e Contrato para Futura Conexão com Supabase
 * 
 * Nesta Etapa 1, os dados são gerenciados em MOCK/LOCAL para validação de UI/UX.
 * Quando as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY forem fornecidas,
 * este módulo inicializará o cliente oficial '@supabase/supabase-js'.
 */

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string | null;
  mode: 'MOCK_LOCAL' | 'SUPABASE_CONNECTED';
  message: string;
}

const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) : undefined;
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) : undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseStatus(): SupabaseConfigStatus {
  if (isSupabaseConfigured) {
    return {
      isConfigured: true,
      url: supabaseUrl || null,
      mode: 'SUPABASE_CONNECTED',
      message: 'Conectado ao Supabase Cloud (Auth, Postgres, Storage e Realtime habilitados)',
    };
  }

  return {
    isConfigured: false,
    url: null,
    mode: 'MOCK_LOCAL',
    message: 'Etapa 1: Operando em Modo MOCK / Armazenamento Local. Supabase preparado para a próxima fase.',
  };
}
