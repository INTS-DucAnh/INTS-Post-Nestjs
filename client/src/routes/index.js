import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./private";
import AuthRoute from "./auth";
import LoginRoute from "./auth/login";
import DashboardRoute from "./private/dashboard";
import CategoryRoute from "./private/categories";
import BreadcrumbProvider from "../context/breadcromb.context";
import { Outlet } from "react-router-dom";
import CategoryDialogProvider from "../context/category-dialog.context";
import PostRoute from "./private/posts";
import PostDialogProvider from "../context/posts-dialog.context";
import UserDialogProvider from "../context/user-dialog.context";
import ProfileRoute from "./private/profile";

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
          <Route
            path="/"
            element={
              <UserDialogProvider>
                <DashboardRoute />
              </UserDialogProvider>
            }
          />
          <Route
            path="/m"
            element={
              <UserDialogProvider>
                <ProfileRoute />
              </UserDialogProvider>
            }
          />
          <Route
            path="/posts"
            element={
              <PostDialogProvider>
                <PostRoute />
              </PostDialogProvider>
            }
          />
          <Route
            path="/categories"
            element={
              <CategoryDialogProvider>
                <CategoryRoute />
              </CategoryDialogProvider>
            }
          />
        </Route>
      </Route>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginRoute />} />
        {/* <Route path="/signup" element={<SignupRoute />} /> */}
      </Route>

      <Route path="/*" element={<p>Route not found</p>} />
    </Routes>
  );
}
