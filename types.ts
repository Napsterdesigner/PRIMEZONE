
export interface Member {
  id: string;
  name: string;
  role: string;
  img: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO Date strings (YYYY-MM-DD)
  createdAt: number;
}

export interface AppState {
  isLogged: boolean;
  isAdmin: boolean;
  activeMember: Member;
  selectedDate: string;
  loading: boolean;
}
