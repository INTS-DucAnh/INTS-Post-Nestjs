import { useContext, useEffect, useState } from "react";
import NavLink from "../navLink";
import { NavBarHeading, NavBarMain, NavBarHolder } from "./styled";
import { useLocation } from "react-router-dom";
import { BreadcrumbContext } from "../../context/breadcromb.context";

export default function NavPane() {
  const { addBreadcrumb } = useContext(BreadcrumbContext);
  const [selected, SetSelected] = useState(0);
  const search = useLocation();
  const routeList = [
    { name: "User", link: "/", icon: "pi-user" },
    { name: "Post", link: "/posts", icon: "pi-file-edit" },
    { name: "Category", link: "/categories", icon: "pi-filter" },
  ];

  useEffect(() => {
    SetSelected(routeList.findIndex((e) => e.link.startsWith(search.pathname)));
  }, [search]);

  return (
    <NavBarHolder>
      <NavBarHeading>
        <NavLink
          route={{ name: "Admin", link: "/", icon: "pi-bolt" }}
          onClick={() => {
            SetSelected(0);
          }}
          isPrimary
        />
      </NavBarHeading>
      <NavBarMain>
        {routeList.map((route, idx) => (
          <NavLink
            key={route.name}
            selected={idx === selected}
            route={route}
            onClick={() => {
              SetSelected(idx);
            }}
          />
        ))}
      </NavBarMain>
    </NavBarHolder>
  );
}
