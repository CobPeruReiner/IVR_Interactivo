import { useContext, useState } from "react";
import { toast, Toaster } from "sonner";
import { inputBorder, labelBorder } from "../../UI/Inputs";
import { AuthContext } from "../../Context/AuthContext";

export const ForgetPassword = () => {
  const { posting, ForgetPasswordRequest } = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("El correo es obligatorio");
      return;
    }

    const ok = await ForgetPasswordRequest(email);

    if (ok) {
      toast.success("Correo enviado");
    } else {
      toast.warning("Correo no registrado");
    }
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">
            Recuperar contraseña
          </h2>

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="relative">
              <input
                type="email"
                className={inputBorder}
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={posting}
              />
              <label className={labelBorder}>Correo</label>
            </div>

            <button
              disabled={posting}
              className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-black/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none transition-all duration-500"
            >
              Enviar correo
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
