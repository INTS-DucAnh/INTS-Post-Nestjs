import { useNavigate } from "react-router-dom";
import { NavLinkHolder } from "./styled";

export default function NavLink({ route, selected, onClick, ...props }) {
  const navigate = useNavigate();
  const handleSelect = () => {
    document.title = route.name;
    navigate(route.link);
  };
  return (
    <NavLinkHolder
      {...props}
      onClick={() => {
        onClick();
        handleSelect();
      }}
      className={selected && "selected"}
    >
      <div onClick={() => navigate(route.link)}>
        <i className={`pi ${route.icon}`}></i>
        <p>{route.name}</p>
      </div>
    </NavLinkHolder>
  );
}
