import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { toast, Toaster } from "sonner";
import { View, ViewOff } from "../../UI/Iconos";
import { inputBorder, labelBorder } from "../../UI/Inputs";
import { Link } from "react-router-dom";

export const Login = () => {
  const { posting, LoginRequest } = useContext(AuthContext);

  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.usuario.trim() || !form.password.trim()) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    const ok = await LoginRequest(form);

    if (ok) {
      toast.success("Bienvenido");
    } else {
      toast.warning("Credenciales incorrectas");
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Iniciar Sesión
          </h2>
          <p className="text-center text-gray-500 mt-1">
            Ingresar DNI y contraseña para ingresar
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder=""
                className={inputBorder}
                value={form.usuario}
                onChange={(e) =>
                  setForm({ ...form, usuario: e.target.value.trim() })
                }
                disabled={posting}
              />
              <label className={labelBorder}>DNI</label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className={inputBorder}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={posting}
              />

              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 text-xl cursor-pointer transition-all duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOff /> : <View />}
              </button>

              <label className={labelBorder}>Contraseña</label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-black/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none transition-all duration-500"
              disabled={posting}
            >
              Iniciar Sesión
            </button>
            <div className="flex justify-end mt-2">
              <button type="button" disabled={posting}>
                <Link
                  to="/forget-password"
                  className="text-sm text-[#09c] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
