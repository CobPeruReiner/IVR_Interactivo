import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicRoutes } from "./Routes/PublicRoutes";
import { ProtectedRoutes } from "./Routes/ProtectedRoutes";
import { Login } from "./Pages/Auth/Login";
import { Home } from "./Pages/Home/Home";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";
import { Loading } from "./Components/Loading";
import { PageNotFound } from "./Pages/PageNotFound/PageNotFound";
import { ForgetPassword } from "./Pages/Auth/ForgetPassword";
import { ResetPassword } from "./Pages/Auth/ResetPassword";

export const App = () => {
  const { auth, RefreshTokenRequest } = useContext(AuthContext);

  useEffect(() => {
    RefreshTokenRequest();
  }, [RefreshTokenRequest]);

  if (auth.checking) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
