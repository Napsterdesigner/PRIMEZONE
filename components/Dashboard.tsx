
import React, { useState } from 'react';
import { AppState, Habit, Member } from '../types';
import { TEAM } from '../constants';
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Trash2, 
  LogOut,
  Trophy
} from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import TeamBenchmarkChart from './TeamBenchmarkChart';

interface DashboardProps {
  state: AppState;
  habits: Habit[];
  allHabits: Record<string, Habit[]>;
  onLogout: () => void;
  onSwitchMember: (id: string) => void;
  onChangeDate: (offset: number) => void;
  onAddHabit: (name: string) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  state,
  habits,
  allHabits,
  onLogout,
  onSwitchMember,
  onChangeDate,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit
}) => {
  const [newHabitName, setNewHabitName] = useState('');

  const doneToday = habits.filter(h => h.completedDays.includes(state.selectedDate)).length;
  const total = habits.length;
  const progress = total > 0 ? Math.round((doneToday / total) * 100) : 0;
  
  const dateStr = new Date(state.selectedDate + "T12:00:00").toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long' 
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const topPerformer = React.useMemo(() => {
    let top = { name: 'Monitorando...', points: 0 };
    TEAM.forEach(m => {
      const mHabits = allHabits[m.id] || [];
      const points = mHabits.reduce((acc, h) => acc + h.completedDays.length, 0);
      if (points > top.points) {
        top = { name: m.name, points };
      }
    });
    return top;
  }, [allHabits]);

  return (
    <div className="flex w-full h-full animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-72 glass flex flex-col h-full z-10 shrink-0 border-r border-white/10">
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tighter uppercase italic">Primezone</span>
          </div>
          
          <div className="space-y-1">
            {TEAM.filter(m => state.isAdmin || m.id === state.activeMember.id).map(m => (
              <button 
                key={m.id}
                onClick={() => onSwitchMember(m.id)} 
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                  state.activeMember.id === m.id 
                    ? 'bg-purple-500/20 border border-purple-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <img src={m.img} className="w-9 h-9 rounded-xl object-cover shadow-md" alt={m.name} />
                <div className="text-left overflow-hidden">
                  <p className={`text-[11px] font-bold truncate ${state.activeMember.id === m.id ? 'text-white' : 'text-slate-400'}`}>
                    {m.name}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-500 hover:text-rose-500 transition-all text-[9px] font-black uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <img 
              src={state.activeMember.img} 
              className="w-24 h-24 rounded-[1.8rem] object-cover border-2 border-white/10 shadow-2xl" 
              alt={state.activeMember.name} 
            />
            <div>
              <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">
                {state.activeMember.name.split(' ')[0]}
              </h2>
              <p className="text-purple-400 font-black text-[11px] uppercase tracking-[0.6em] mt-2">
                {state.activeMember.role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-7 py-4 glass rounded-3xl">
            <button onClick={() => onChangeDate(-1)} className="p-1 hover:scale-125 transition-transform">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-sm uppercase tracking-[0.2em] min-w-[140px] text-center">
              {dateStr}
            </span>
            <button onClick={() => onChangeDate(1)} className="p-1 hover:scale-125 transition-transform">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3 glass p-10 rounded-[2.5rem]">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Métrica de Performance</p>
            <div className="h-48 w-full">
              <PerformanceChart habits={habits} />
            </div>
          </div>
          <div className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-black mb-1 text-purple-400">{progress}%</div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conclusão</p>
          </div>
        </div>

        {/* Admin Section */}
        {state.isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Benchmark Equipe</p>
              <div className="h-56">
                <TeamBenchmarkChart allHabits={allHabits} />
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Liderança</p>
              <div className="flex items-center gap-4 text-white font-bold">
                {topPerformer.points > 0 ? (
                  <>
                    <div className="bg-amber-500/20 p-3 rounded-2xl">
                      <Trophy className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-amber-500 text-lg">{topPerformer.name}</p>
                      <p className="text-[10px] uppercase text-slate-500">{topPerformer.points} Pontos Totais</p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic">Monitorando Rede Ativa...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Habit Form */}
        <form onSubmit={handleAddSubmit} className="relative mb-12 max-w-4xl">
          <input 
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            type="text" 
            autoComplete="off" 
            placeholder="Definir nova meta prioritária..." 
            className="w-full bg-transparent border-b-2 border-white/10 py-6 pr-36 outline-none focus:border-purple-500 text-2xl font-bold transition-all placeholder:text-white/10"
          />
          <button 
            type="submit" 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white transition-all shadow-lg shadow-purple-500/20"
          >
            Deploy
          </button>
        </form>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
          {habits.sort((a, b) => b.createdAt - a.createdAt).map(h => {
            const isDone = h.completedDays.includes(state.selectedDate);
            const streak = h.completedDays.length;
            const progressWidth = Math.min(streak * 10, 100);

            return (
              <div 
                key={h.id} 
                className={`glass p-7 rounded-[2rem] flex flex-col justify-between h-48 transition-all hover:-translate-y-1 group ${
                  isDone ? 'border-green-500/40 bg-green-500/5' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => onToggleHabit(h.id)} 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isDone ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={() => onDeleteHabit(h.id)} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-rose-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h4 className={`font-extrabold text-lg mb-2 leading-tight transition-all ${
                    isDone ? 'text-slate-500 line-through' : 'text-white'
                  }`}>
                    {h.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500" 
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase whitespace-nowrap">
                      {streak} PTS
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
