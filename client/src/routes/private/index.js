import { Navigate, Outlet } from "react-router-dom";
import UseToken from "../../hooks/useToken";
import NavPane from "../../component/navbar";
import { HeadingRoute } from "./styled";
import { useNavigate } from "react-router-dom";
import useRequestApi from "../../hooks/useRequestApi";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContext } from "../../context/toast.context";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import {
  TempalteUserDetail,
  TemplateUser,
  TemplateUserImage,
} from "./dashboard/styled";
import { BreadCrumb } from "primereact/breadcrumb";
import { BreadcrumbContext } from "../../context/breadcromb.context";

const MenuTemplate = (item) => {
  return (
    <div className="p-menuitem-content w-full">
      <button
        style={{ width: "100%", border: "none", background: "none" }}
        className="flex align-items-center p-menuitem-link"
        onClick={item.click}
      >
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
      </button>
    </div>
  );
};

export default function PrivateRoute() {
  const { getToken, clearToken } = UseToken();
  const { RequestApi } = useRequestApi();
  const { showToast } = useContext(ToastContext);
  const { breadcrumb } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const settingRef = useRef(null);
  const [user, SetUser] = useState({});
  const items = [
    {
      label: "Profile",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          click: () => navigate(`m/${user.id}`),
          template: MenuTemplate,
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          click: () => logout(),
          template: MenuTemplate,
        },
      ],
    },
  ];

  const logout = async () => {
    return RequestApi({
      method: "GET",
      path: "auth/logout",
    }).then((res) => {
      if (res) {
        showToast("success", "Success!", "Logged out!");
        SetUser({});
        clearToken();
        navigate("/login");
      }
    });
  };

  const getMyProfile = async () => {
    RequestApi({
      method: "GET",
      path: "user",
    }).then((res) => {
      if (res) {
        SetUser(res.data);
      }
    });
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  if (!getToken()) return <Navigate to={"/login"} />;
  return (
    <section className="flex flex-row h-full w-full overflow-hidden gap-2 ">
      <div className="h-auto w-auto">
        <NavPane />
      </div>
      <div className="flex-1 overflow-y-scroll box-border p-4">
        <HeadingRoute>
          <div>
            <BreadCrumb
              model={breadcrumb}
              home={{ icon: "pi pi-home", url: "/" }}
            />
          </div>

          <div className="card flex justify-content-right">
            <Button
              onClick={(e) => settingRef.current.toggle(e)}
              aria-controls="settingModal"
              aria-haspopup
              popupAlignment="right"
              severity="primary"
              outlined
              className="p-2"
            >
              <TemplateUser>
                <TemplateUserImage>
                  {user.avatar ? (
                    <img alt="user img" src={user.avatar} />
                  ) : (
                    <p>
                      {user.firstname && user.firstname[0].toUpperCase()}
                      {user.lastname && user.lastname[0].toUpperCase()}
                    </p>
                  )}
                </TemplateUserImage>
                <TempalteUserDetail>
                  <p>
                    {user.firstname} {user.lastname}
                  </p>
                </TempalteUserDetail>
              </TemplateUser>
            </Button>
            <Menu
              model={items}
              id="settingModal"
              ref={settingRef}
              popupAlignment="right"
              popup
              className="p-0"
              style={{ fontSize: "1rem" }}
            />
          </div>
        </HeadingRoute>
        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
