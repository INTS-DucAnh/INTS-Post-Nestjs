import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./private";
import AuthRoute from "./auth";
import LoginRoute from "./auth/login";
import SignupRoute from "./auth/signup";
import DashboardRoute from "./private/dashboard";
import CategoryRoute from "./private/categories";
import BreadcrumbProvider from "../context/breadcromb.context";
import { Outlet } from "react-router-dom";

export default function AppRouter() {
  const BreadCrumb = () => {
    return (
      <BreadcrumbProvider>
        <Outlet />
      </BreadcrumbProvider>
    );
  };
  return (
    <Routes>
      <Route element={<BreadCrumb />}>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardRoute />} />
          <Route path="/m/:id" element={<p>Private: User Profile</p>} />
          <Route path="/posts" element={<p>Private: Posts</p>} />
          <Route path="/categories" element={<CategoryRoute />} />
        </Route>
      </Route>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
      </Route>

      <Route path="/*" element={<p>Route not found</p>} />
    </Routes>
  );
}
