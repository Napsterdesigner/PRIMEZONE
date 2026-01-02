
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TEAM, ACCESS_KEYS } from './constants';
import { Member, Habit, AppState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLogged: localStorage.getItem('pz_logged') === 'true',
    isAdmin: localStorage.getItem('pz_is_admin') === 'true',
    activeMember: TEAM.find(m => m.id === localStorage.getItem('pz_active_id')) || TEAM[0],
    selectedDate: new Date().toISOString().split('T')[0],
    loading: true, // Initial loading state
  });

  const [habits, setHabits] = useState<Record<string, Habit[]>>(() => {
    const saved = localStorage.getItem('pz_habits_store');
    return saved ? JSON.parse(saved) : {};
  });

  // Resolve infinite loading by ensuring initialization always completes
  useEffect(() => {
    const initApp = async () => {
      // Simulate network sync/auth check
      await new Promise(resolve => setTimeout(resolve, 800));
      setState(prev => ({ ...prev, loading: false }));
    };

    initApp();
  }, []);

  // Sync habits to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('pz_habits_store', JSON.stringify(habits));
  }, [habits]);

  const handleLogin = useCallback((key: string) => {
    const role = ACCESS_KEYS[key.toUpperCase()];
    if (role) {
      const isAdmin = role === 'admin';
      const activeMember = isAdmin ? TEAM[0] : TEAM.find(m => m.id === role)!;

      setState(prev => ({
        ...prev,
        isLogged: true,
        isAdmin,
        activeMember,
      }));

      localStorage.setItem('pz_logged', 'true');
      localStorage.setItem('pz_is_admin', String(isAdmin));
      localStorage.setItem('pz_active_id', activeMember.id);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLogged: false,
      isAdmin: false,
    }));
    localStorage.removeItem('pz_logged');
    localStorage.removeItem('pz_is_admin');
    localStorage.removeItem('pz_active_id');
  }, []);

  const switchMember = useCallback((id: string) => {
    const member = TEAM.find(m => m.id === id);
    if (member) {
      setState(prev => ({ ...prev, activeMember: member }));
      localStorage.setItem('pz_active_id', id);
    }
  }, []);

  const changeDate = useCallback((offset: number) => {
    setState(prev => {
      const d = new Date(prev.selectedDate + "T12:00:00");
      d.setDate(d.getDate() + offset);
      return { ...prev, selectedDate: d.toISOString().split('T')[0] };
    });
  }, []);

  const addHabit = useCallback((name: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      completedDays: [],
      createdAt: Date.now(),
    };
    
    setHabits(prev => ({
      ...prev,
      [state.activeMember.id]: [newHabit, ...(prev[state.activeMember.id] || [])]
    }));
  }, [state.activeMember.id]);

  const toggleHabit = useCallback((habitId: string) => {
    setHabits(prev => {
      const memberHabits = prev[state.activeMember.id] || [];
      const updated = memberHabits.map(h => {
        if (h.id === habitId) {
          const completed = h.completedDays.includes(state.selectedDate);
          return {
            ...h,
            completedDays: completed 
              ? h.completedDays.filter(d => d !== state.selectedDate)
              : [...h.completedDays, state.selectedDate]
          };
        }
        return h;
      });
      return { ...prev, [state.activeMember.id]: updated };
    });
  }, [state.activeMember.id, state.selectedDate]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => ({
      ...prev,
      [state.activeMember.id]: (prev[state.activeMember.id] || []).filter(h => h.id !== habitId)
    }));
  }, [state.activeMember.id]);

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

  return (
    <div className="h-screen w-full flex overflow-hidden relative">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center" 
        style={{ backgroundImage: `url('https://wallpapers.com/images/hd/purple-city-lights-x14uc9hkwvor0pxe.jpg')` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-[35px] saturate-[160%]" />

      {!state.isLogged ? (
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
      )}
    </div>
  );
};

export default App;
