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

  const [posting, setPosting] = useState(false);

  const LoginRequest = async (
    credentials: CredentialsLoginState
  ): Promise<boolean> => {
    setPosting(true);

    try {
      const { data } = await api.post<SuccesResponseLogin>(
        "/auth/login",
        credentials
      );

      localStorage.setItem("token", data.token);

      setAuth({
        checking: false,
        logged: true,
        user: data.user,
      });

      return true;
    } catch (err) {
      console.error("Error en Login:", err);

      return false;
    } finally {
      setPosting(false);
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

  const ForgetPasswordRequest = async (email: string): Promise<boolean> => {
    setPosting(true);

    try {
      await api.post("/auth/forget-password", { email });
      return true;
    } catch (error) {
      console.error("Error en ForgetPassword:", error);
      return false;
    } finally {
      setPosting(false);
    }
  };

  const ResetPasswordRequest = async (
    token: string | undefined,
    newPassword: string
  ): Promise<boolean> => {
    setPosting(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });

      return true;
    } catch (error) {
      console.error("Error en ResetPassword:", error);

      return false;
    } finally {
      setPosting(false);
    }
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

      const { data } = await api.get<SuccesResponseLogin>("/auth/refresh", {
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
        posting,
        auth,
        LoginRequest,
        LogoutRequest,
        ForgetPasswordRequest,
        ResetPasswordRequest,
        RefreshTokenRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
