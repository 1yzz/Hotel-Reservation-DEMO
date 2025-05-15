import { createStore } from 'solid-js/store';
import { User } from '../types/user';

interface UserState {
  user: User | null;
  loading: boolean;
}

const [state, setState] = createStore<UserState>({
  user: null,
  loading: true
});

export const userStore = {
  state,
  setUser: (user: User | null) => setState('user', user),
  setLoading: (loading: boolean) => setState('loading', loading),
  clearUser: () => setState('user', null)
}; 