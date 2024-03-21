const LIFE = 3600;

const TOAST = {
  success: { severity: "success", summary: "Success", life: LIFE },
  info: { severity: "info", summary: "Info", life: LIFE },
  warning: { severity: "warn", summary: "Warning", life: LIFE },
  error: { severity: "error", summary: "Error", life: LIFE },
  secondary: { severity: "secondary", summary: "Secondary", life: LIFE },
  contrast: { severity: "contrast", summary: "Contrast", life: LIFE },
};

export const ToastSuccess = (detail) => {
  return {
    ...TOAST.success,
    detail,
  };
};

export const ToastError = (detail) => {
  return {
    ...TOAST.error,
    detail,
  };
};

export const ToastInfo = (detail) => {
  return {
    ...TOAST.info,
    detail,
  };
};

export const ToastWarning = (detail) => {
  return {
    ...TOAST.warning,
    detail,
  };
};

export const ToastSecondary = (detail) => {
  return {
    ...TOAST.secondary,
    detail,
  };
};

export const ToastContrast = (detail) => {
  return {
    ...TOAST.contrast,
    detail,
  };
};
