import { createContext, useState } from "react";

export const BreadcrumbContext = createContext();

export default function BreadcrumbProvider({ children }) {
  const [breadcrumb, SetBreadcrumb] = useState([]);

  const addBreadcrumb = (labels, index) => {
    SetBreadcrumb((breadcrumb) => [...breadcrumb.slice(0, index), labels]);
  };

  const removeBreadcrumb = (index) => {
    SetBreadcrumb((breadcrumb) => breadcrumb.filter((_, id) => id <= index));
  };

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumb, addBreadcrumb, removeBreadcrumb }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
