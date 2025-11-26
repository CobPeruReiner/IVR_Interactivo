import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { inputBorder, labelBorder } from "../../UI/Inputs";
import { View, ViewOff } from "../../UI/Iconos";

export const ResetPassword = () => {
  const { posting, ResetPasswordRequest, LogoutRequest } =
    useContext(AuthContext);

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);

  const passwordsMatch =
    password.length > 0 && password2.length > 0 && password === password2;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.warning("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (!passwordsMatch) {
      toast.warning("Las contraseñas no coinciden");
      return;
    }

    const ok = await ResetPasswordRequest(token, password);

    if (ok) {
      toast.success("Contraseña cambiada con éxito");

      LogoutRequest();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } else {
      toast.error("Error al cambiar la contraseña");
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">Nueva contraseña</h2>

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputBorder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={posting}
              />
              <label className={labelBorder}>Nueva contraseña</label>

              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 text-xl cursor-pointer transition-all duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOff /> : <View />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                className={inputBorder}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                disabled={posting}
              />
              <label className={labelBorder}>Repetir contraseña</label>

              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 text-xl cursor-pointer transition-all duration-300"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <ViewOff /> : <View />}
              </button>

              {password && password2 && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1">
                  Las contraseñas no coinciden
                </p>
              )}

              {passwordsMatch && (
                <p className="text-green-600 text-xs mt-1">
                  Las contraseñas coinciden
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!passwordsMatch || posting}
              className="w-full bg-black text-white py-2 rounded-md font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Guardar contraseña
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
