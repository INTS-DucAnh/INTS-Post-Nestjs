import { createContext, useRef } from "react";
import { Toast } from "primereact/toast";

export const ToastContext = createContext();

export default function ToastProvider({ children }) {
  const toastRef = useRef();
  const showToast = (toast) => {
    toastRef.current.show(toast);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
}
