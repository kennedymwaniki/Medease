import { Store } from '@tanstack/store'

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const authStore = new Store({
  initialState,
})
export const authctions = {
  setUser: (data: any) => {
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: true,
      user: data.user,
      token: data.token,
    }))
    localStorage.setItem('auth', JSON.stringify(data))
  },
  clearUser: () => {
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
    }))
    localStorage.removeItem('auth')
  },
}
