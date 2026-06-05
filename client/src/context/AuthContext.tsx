import { createContext, useContext, useEffect, useState } from "react";
import { api, type Session, type User } from "@/lib/api";

const STORAGE_KEY = "ethio-session";
type AuthContextValue = {
  user: User | null;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Pick<User, "name" | "phone" | "address" | "city" | "country">) => Promise<void>;
  updatePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storedSession = (): Session | null => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initial = storedSession();
  const [user, setUser] = useState<User | null>(initial?.user ?? null);
  const [token, setToken] = useState(initial?.token ?? "");
  const [loading, setLoading] = useState(Boolean(initial?.token));

  const saveSession = (session: Session) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session.user);
    setToken(session.token);
  };

  useEffect(() => {
    if (!token) return;
    api.getMe(token).then((nextUser) => {
      setUser(nextUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
    }).catch(() => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setToken("");
    }).finally(() => setLoading(false));
  }, [token]);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login: async (email, password) => saveSession(await api.login({ email, password })),
      register: async (name, email, password) => saveSession(await api.register({ name, email, password })),
      logout,
      updateProfile: async (profile) => {
        if (!token) throw new Error("Sign in to update your profile");
        const nextUser = await api.updateProfile(profile, token);
        setUser(nextUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
      },
      updatePassword: async (currentPassword, nextPassword) => {
        if (!token) throw new Error("Sign in to update your password");
        await api.updatePassword({ currentPassword, nextPassword }, token);
      },
      toggleWishlist: async (productId) => {
        if (!token) throw new Error("Sign in to save favorites");
        const nextUser = await api.toggleWishlist(productId, token);
        setUser(nextUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
      },
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
