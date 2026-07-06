import { createContext, useContext, useEffect, useState } from "react";

interface User {
  emp_id: number;
  emp_name: string;
  designation: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loginUser: (user: User, rememberMe?: boolean) => void;
  logoutUser: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("sprinklez_user") ||
      sessionStorage.getItem("sprinklez_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (userData: User, rememberMe = false) => {
    setUser(userData);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("sprinklez_user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("sprinklez_user");
    sessionStorage.removeItem("sprinklez_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}