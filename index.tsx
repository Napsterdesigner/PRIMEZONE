import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
    Zap, ChevronLeft, ChevronRight, Check, Plus, Trash2, LogOut, Trophy 
} from 'lucide-react';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar, Cell
} from 'recharts';

// --- Types ---
interface Member {
    id: string;
    name: string;
    role: string;
    img: string;
}

interface Habit {
    id: string;
    name: string;
    completedDays: string[];
    createdAt: number;
}

// --- Constants ---
const TEAM: Member[] = [
    { id: "u1", name: "ALEX FENIAS", role: "Funnel Builder", img: "https://i.postimg.cc/XZQw9gr3/ALEX.png" },
    { id: "u2", name: "ARCENIO HUMBERTO", role: "Copywriter", img: "https://i.postimg.cc/0Mj7nJSk/ARCENIO.png" },
    { id: "u3", name: "SCHNAYDER NANGY", role: "VSL Creator", img: "https://i.postimg.cc/r0s5jt45/NAPSTER.png" },
    { id: "u4", name: "ARTUR NAKARAPA", role: "Ads Maker", img: "https://i.postimg.cc/PpJ1y8Dd/ARTUR.png" },
    { id: "u5", name: "AGAPITO SUMBANE", role: "Offers Miner", img: "https://i.postimg.cc/Xv5QPMRt/AGAPITO.png" }
];

const ACCESS_KEYS: Record<string, string> = {
    "PRETOSOLTO": "u1", "BADWOLF": "u2", "NAPSTER": "u3", "NAKA": "u4", "OTIPJAN": "u5", "PRIME": "admin"
};

// --- Sub-Components ---

const Login = ({ onLogin }: { onLogin: (key: string) => boolean }) => {
    const [key, setKey] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onLogin(key)) {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="w-full flex items-center justify-center p-6 h-screen animate-pop">
            <div className="glass p-12 rounded-[2.5rem] w-full max-sm:p-8 max-w-sm text-center shadow-2xl">
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
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        placeholder="SUA CHAVE" 
                        className="w-full bg-white/5 border border-white/10 py-5 px-6 rounded-2xl text-center text-sm font-bold tracking-[0.2em] outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-white"
                    />
                    {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest animate-bounce">Chave Inválida</p>}
                    <button type="submit" className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-500/20">Entrar na Rede</button>
                </form>
            </div>
        </div>
    );
};

const CustomPerformanceChart = ({ habits }: { habits: Habit[] }) => {
    const data = useMemo(() => {
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const str = d.toISOString().split('T')[0];
            const count = habits.filter(h => h.completedDays.includes(str)).length;
            chartData.push({
                name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
                value: count,
            });
        }
        return chartData;
    }, [habits]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 800 }}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const CustomBenchmarkChart = ({ allHabits }: { allHabits: Record<string, Habit[]> }) => {
    const data = useMemo(() => {
        return TEAM.map(m => ({
            name: m.name.split(' ')[0],
            score: (allHabits[m.id] || []).reduce((acc, h) => acc + h.completedDays.length, 0)
        }));
    }, [allHabits]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {data.map((_, index) => <Cell key={`cell-${index}`} fill="#a855f7" fillOpacity={0.4 + (index / data.length) * 0.6} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const Dashboard = ({ state, habits, allHabits, onLogout, onSwitchMember, onChangeDate, onAddHabit, onToggleHabit, onDeleteHabit }: any) => {
    const [newHabit, setNewHabit] = useState('');
    const doneToday = habits.filter((h: Habit) => h.completedDays.includes(state.selectedDate)).length;
    const progress = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0;
    const dateStr = new Date(state.selectedDate + "T12:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

    const topPerformer = useMemo(() => {
        let top = { name: 'Monitorando...', points: 0 };
        TEAM.forEach(m => {
            const pts = (allHabits[m.id] || []).reduce((acc, h) => acc + h.completedDays.length, 0);
            if (pts > top.points) top = { name: m.name, points: pts };
        });
        return top;
    }, [allHabits]);

    return (
        <div className="flex w-full h-full animate-in fade-in duration-500">
            <aside className="w-72 glass flex flex-col h-full z-10 shrink-0 max-lg:hidden">
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-purple-600 p-2 rounded-xl shadow-lg"><Zap className="w-5 h-5 text-white" /></div>
                        <span className="font-extrabold text-xl tracking-tighter uppercase italic">Primezone</span>
                    </div>
                    <div className="space-y-1">
                        {TEAM.filter(m => state.isAdmin || m.id === state.activeMember.id).map(m => (
                            <button 
                                key={m.id}
                                onClick={() => onSwitchMember(m.id)} 
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${state.activeMember.id === m.id ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <img src={m.img} className="w-9 h-9 rounded-xl object-cover" alt={m.name} />
                                <div className="text-left overflow-hidden">
                                    <p className={`text-[11px] font-bold truncate ${state.activeMember.id === m.id ? 'text-white' : 'text-slate-400'}`}>{m.name}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">{m.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-white/5">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all text-[9px] font-black uppercase tracking-widest"><LogOut className="w-3 h-3" /> Sair</button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-16 max-md:p-6">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 max-md:mb-8">
                    <div className="flex items-center gap-8 max-md:gap-4">
                        <img src={state.activeMember.img} className="w-24 h-24 max-md:w-16 max-md:h-16 rounded-[1.8rem] object-cover border-2 border-white/10 shadow-2xl" alt={state.activeMember.name} />
                        <div>
                            <h2 className="text-6xl max-md:text-4xl font-black tracking-tighter uppercase leading-none">{state.activeMember.name.split(' ')[0]}</h2>
                            <p className="text-purple-400 font-black text-[11px] uppercase tracking-[0.6em] mt-2">{state.activeMember.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 px-7 py-4 glass rounded-3xl max-md:px-4 max-md:py-2 max-md:w-full max-md:justify-between">
                        <button onClick={() => onChangeDate(-1)}><ChevronLeft className="w-6 h-6" /></button>
                        <span className="font-bold text-sm uppercase tracking-[0.2em] min-w-[140px] text-center">{dateStr}</span>
                        <button onClick={() => onChangeDate(1)}><ChevronRight className="w-6 h-6" /></button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                    <div className="lg:col-span-3 glass p-10 rounded-[2.5rem] max-md:p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Métrica de Performance</p>
                        <div className="h-48 w-full"><CustomPerformanceChart habits={habits} /></div>
                    </div>
                    <div className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                        <div className="text-5xl font-black mb-1 text-purple-400">{progress}%</div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conclusão</p>
                    </div>
                </div>

                {state.isAdmin && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 animate-pop">
                        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] max-md:p-6">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Benchmark Equipe</p>
                            <div className="h-56"><CustomBenchmarkChart allHabits={allHabits} /></div>
                        </div>
                        <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center max-md:p-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Liderança</p>
                            <div className="flex items-center gap-4 text-white font-bold">
                                <Trophy className="text-amber-500 w-8 h-8" />
                                <div>
                                    <p className="text-amber-500 text-lg">{topPerformer.name}</p>
                                    <p className="text-[10px] uppercase text-slate-500">{topPerformer.points} Pontos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); onAddHabit(newHabit); setNewHabit(''); }} className="relative mb-12 max-w-4xl">
                    <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} type="text" placeholder="Definir nova meta prioritária..." className="w-full bg-transparent border-b-2 border-white/10 py-6 pr-36 max-md:pr-24 outline-none focus:border-purple-500 text-2xl font-bold transition-all placeholder:text-white/10" />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-lg shadow-purple-500/20 max-md:px-4">Deploy</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                    {habits.sort((a: Habit, b: Habit) => b.createdAt - a.createdAt).map((h: Habit) => {
                        const isDone = h.completedDays.includes(state.selectedDate);
                        return (
                            <div key={h.id} className={`glass p-7 rounded-[2rem] flex flex-col justify-between h-48 transition-all hover:-translate-y-1 group ${isDone ? 'border-green-500/40 bg-green-500/5' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <button onClick={() => onToggleHabit(h.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'}`}>
                                        {isDone ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                    </button>
                                    <button onClick={() => onDeleteHabit(h.id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-rose-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                                </div>
                                <div>
                                    <h4 className={`font-extrabold text-lg mb-2 leading-tight ${isDone ? 'text-slate-500 line-through' : 'text-white'}`}>{h.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${Math.min(h.completedDays.length * 10, 100)}%` }}></div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase">{h.completedDays.length} PTS</span>
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

const App = () => {
    const [state, setState] = useState({
        isLogged: localStorage.getItem('pz_logged') === 'true',
        isAdmin: localStorage.getItem('pz_is_admin') === 'true',
        activeMember: TEAM.find(m => m.id === localStorage.getItem('pz_active_id')) || TEAM[0],
        selectedDate: new Date().toISOString().split('T')[0],
        loading: true,
    });

    const [habits, setHabits] = useState<Record<string, Habit[]>>(() => {
        const saved = localStorage.getItem('pz_habits_store');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        const timer = setTimeout(() => setState(prev => ({ ...prev, loading: false })), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('pz_habits_store', JSON.stringify(habits));
    }, [habits]);

    const handleLogin = (key: string) => {
        const role = ACCESS_KEYS[key.toUpperCase()];
        if (role) {
            const isAdmin = role === 'admin';
            const member = isAdmin ? TEAM[0] : TEAM.find(m => m.id === role);
            if (!member) return false;
            setState(prev => ({ ...prev, isLogged: true, isAdmin, activeMember: member }));
            localStorage.setItem('pz_logged', 'true');
            localStorage.setItem('pz_is_admin', String(isAdmin));
            localStorage.setItem('pz_active_id', member.id);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setState(prev => ({ ...prev, isLogged: false, isAdmin: false }));
        localStorage.clear();
    };

    const switchMember = (id: string) => {
        const member = TEAM.find(m => m.id === id);
        if (member) {
            setState(prev => ({ ...prev, activeMember: member }));
            localStorage.setItem('pz_active_id', id);
        }
    };

    const changeDate = (offset: number) => {
        setState(prev => {
            const d = new Date(prev.selectedDate + "T12:00:00");
            d.setDate(d.getDate() + offset);
            return { ...prev, selectedDate: d.toISOString().split('T')[0] };
        });
    };

    const addHabit = (name: string) => {
        if (!name.trim()) return;
        const h: Habit = { id: Math.random().toString(36).substr(2,9), name, completedDays: [], createdAt: Date.now() };
        setHabits(prev => ({ ...prev, [state.activeMember.id]: [h, ...(prev[state.activeMember.id] || [])] }));
    };

    const toggleHabit = (id: string) => {
        setHabits(prev => {
            const list = (prev[state.activeMember.id] || []).map(h => {
                if (h.id === id) {
                    const done = h.completedDays.includes(state.selectedDate);
                    return { ...h, completedDays: done ? h.completedDays.filter(d => d !== state.selectedDate) : [...h.completedDays, state.selectedDate] };
                }
                return h;
            });
            return { ...prev, [state.activeMember.id]: list };
        });
    };

    const deleteHabit = (id: string) => {
        setHabits(prev => ({ ...prev, [state.activeMember.id]: (prev[state.activeMember.id] || []).filter(h => h.id !== id) }));
    };

    if (state.loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-[9999]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6 animate-pulse" />
                </div>
                <p className="mt-6 text-[10px] font-black tracking-[0.5em] text-purple-400 uppercase animate-pulse">Sincronizando Rede...</p>
            </div>
        );
    }

    return !state.isLogged ? (
        <Login onLogin={handleLogin} />
    ) : (
        <Dashboard 
            state={state} 
            habits={habits[state.activeMember.id] || []}
            allHabits={habits}
            onLogout={handleLogout}
            onSwitchMember={switchMember}
            onChangeDate={changeDate}
            onAddHabit={addHabit}
            onToggleHabit={toggleHabit}
            onDeleteHabit={deleteHabit}
        />
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}