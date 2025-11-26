import { useContext } from "react";
import { Calls, Config, Dashboard, Messages, Off, Roboto } from "../UI/Iconos";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";

export const Aside = () => {
  const { LogoutRequest } = useContext(AuthContext);

  return (
    <div className="fixed top-0 left-0 z-40 flex h-[calc(100vh-2rem)] w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-gray-900/5 translate-x-[-110%] xl:translate-x-0 ml-4 my-4 overflow-y-auto transition-all">
      <div className="relative flex items-center justify-center gap-4 p-4 mb-2">
        <Roboto className="relative text-3xl" />
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-gray-900">
          Sidebar
        </h5>
      </div>
      <nav className="flex min-w-60 flex-col gap-1 p-2 font-sans text-base font-normal text-gray-700">
        <Link to="/" className="relative block w-full">
          <div
            role="button"
            className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none bg-gray-50/50 text-start text-gray-700 hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900"
          >
            <button
              type="button"
              className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-gray-100 text-gray-900 hover:text-gray-900"
            >
              <div className="grid mr-4 place-items-center">
                <Dashboard className="relative text-2xl" />
              </div>
              <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-gray-900">
                Dashboard
              </p>
            </button>
          </div>
        </Link>
        <Link to="/llamadas" className="relative block w-full">
          <div
            role="button"
            className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900"
          >
            <button
              type="button"
              className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-gray-100 text-gray-700 hover:text-gray-900"
            >
              <div className="grid mr-4 place-items-center">
                <Calls className="relative text-2xl" />
              </div>
              <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-gray-900">
                Llamadas
              </p>
            </button>
          </div>
        </Link>
        <Link to="/mensajes" className="relative block w-full">
          <div
            role="button"
            className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900"
          >
            <div className="grid mr-4 place-items-center">
              <Messages className="relative text-2xl" />
            </div>
            <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-gray-900">
              Conversaciones
            </p>
          </div>
        </Link>
        <Link to="/configuracion" className="relative block w-full">
          <div
            role="button"
            className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900"
          >
            <div className="grid mr-4 place-items-center">
              <Config className="relative text-2xl" />
            </div>
            <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-gray-900">
              Settings
            </p>
          </div>
        </Link>
        <button
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-100 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900"
          onClick={LogoutRequest}
        >
          <div className="grid mr-4 place-items-center">
            <Off className="relative text-2xl" />
          </div>
          Log Out
        </button>
      </nav>
    </div>
  );
};
