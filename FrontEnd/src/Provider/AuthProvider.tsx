import { useCallback, useState, type PropsWithChildren } from "react";
import { AuthContext } from "../Context/AuthContext";
import type {
  AuthInitialState,
  CredentialsLoginState,
  SuccesResponseLogin,
} from "../Interfaces/Auth";
import { api } from "../Api/api";

const initialAuth: AuthInitialState = {
  checking: true,
  logged: false,
  user: null,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(initialAuth);

  const [responseToken, setResponseToken] = useState<boolean>(false);

  const LoginRequest = async (
    credentials: CredentialsLoginState
  ): Promise<boolean> => {
    try {
      const { data } = await api.post<SuccesResponseLogin>(
        "/api/auth/login",
        credentials
      );

      localStorage.setItem("token", data.token);

      setAuth({
        checking: false,
        logged: true,
        user: data.user,
      });

      setResponseToken(true);
      return true;
    } catch (err) {
      console.error("Error en Login:", err);

      setResponseToken(false);

      return false;
    }
  };

  const LogoutRequest = () => {
    localStorage.removeItem("token");

    setAuth({
      checking: false,
      logged: false,
      user: null,
    });
  };

  const RefreshTokenRequest = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuth({
          checking: false,
          logged: false,
          user: null,
        });

        return false;
      }

      const { data } = await api.get<SuccesResponseLogin>("/api/auth/refresh", {
        headers: {
          "x-token": token,
        },
      });

      localStorage.setItem("token", data.token);

      setAuth({
        checking: false,
        logged: true,
        user: data.user,
      });

      return true;
    } catch (error) {
      console.error("Error al refrescar token:", error);

      LogoutRequest();

      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        responseToken,
        LoginRequest,
        LogoutRequest,
        RefreshTokenRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
