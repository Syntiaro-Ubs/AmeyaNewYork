import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isAuthenticated: !!user
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
