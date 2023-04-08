import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  isAuth: boolean;
}

interface UserState {
  user: User | null;
}

export const useAuthStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    }
  },
  getters: {
    getUser(): User | null {
      return this.user;
    }
  },
});