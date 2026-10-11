import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/services.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  const bootstrap = useCallback(async () => { try { const result = await authApi.refresh(); setUser(result?.user || null); } catch { setUser(null); } finally { setLoading(false); } }, []);
  useEffect(() => { bootstrap(); const onExpired = () => setUser(null); window.addEventListener('auth:expired', onExpired); return () => window.removeEventListener('auth:expired', onExpired); }, [bootstrap]);
  const login = async (body) => { const result = await authApi.login(body); setUser(result?.user || null); return result; };
  const register = async (body) => { const result = await authApi.register(body); setUser(result?.user || null); return result; };
  const logout = async () => { try { await authApi.logout(); } finally { setUser(null); } };
  const value = useMemo(() => ({ user, role: user?.role, isAuthenticated: !!user, loading, login, register, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
