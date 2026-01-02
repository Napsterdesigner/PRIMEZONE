
import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (key: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const success = onLogin(key);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="glass p-12 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl">
        <div className="mb-12">
          <div className="w-20 h-20 bg-purple-600 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-2xl">
            <Zap className="text-white w-10 h-10 fill-current" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">PRIMEZONE</h1>
          <p className="text-[10px] font-bold text-purple-400 tracking-[0.5em] uppercase opacity-80">Cloud Authentication</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="SUA CHAVE" 
            className="w-full bg-white/5 border border-white/10 py-5 px-6 rounded-2xl text-center text-sm font-bold tracking-[0.2em] outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-white"
          />
          
          {error && (
            <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest animate-bounce">
              Chave Inválida
            </p>
          )}

          <button 
            type="submit"
            className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] bg-purple-600 hover:bg-purple-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white shadow-lg shadow-purple-500/20"
          >
            Entrar na Rede
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
