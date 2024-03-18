import AuthProvider from "../../context/auth.context";
import UseToken from "../../hooks/useToken";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthRoute() {
  const { getToken } = UseToken();

  if (!getToken())
    return (
      <>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </>
    );
  return <Navigate to={"/"} />;
}
