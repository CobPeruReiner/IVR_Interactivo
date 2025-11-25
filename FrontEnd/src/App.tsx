import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicRoutes } from "./Routes/PublicRoutes";
import { ProtectedRoutes } from "./Routes/ProtectedRoutes";
import { Login } from "./Pages/Auth/Login";
import { Home } from "./Pages/Home/Home";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";
import { Loading } from "./Components/Loading";

export const App = () => {
  const { auth, RefreshTokenRequest, responseToken } = useContext(AuthContext);

  useEffect(() => {
    RefreshTokenRequest();
  }, [RefreshTokenRequest, responseToken]);

  if (auth.checking) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
