import { useContext, useState } from "react";
import { ToastContext } from "../context/toast.context";
import env from "react-dotenv";
import UseToken from "./useToken";

const config = {
  host: env.REACT_APP_BACKEND_HOST,
};

export default function useRequestApi() {
  const { showToast } = useContext(ToastContext);
  const { setToken, getToken } = UseToken();

  const RequestApi = async ({
    method,
    path,
    data = {},
    accessToken = false,
    ...props
  }) => {
    try {
      const { headers, ...options } = props;
      const requestRes = await fetch(`${config.host}/${path}`, {
        method: method,
        ...(method !== "GET" ? { body: JSON.stringify(data) } : {}),
        credentials: "include",
        headers: {
          ...headers,
          ...(accessToken ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        ...props,
      });
      const json = await requestRes.json();
      if (json && json.success) {
        return json;
      } else if (requestRes.status === 401 && json.message === "Unauthorized") {
        const getRefreshToken = await RequestAccessToken();
        return await RequestApi({
          method,
          path,
          data,
          headers: {
            ...headers,
            Authorization: `Bearer ${getRefreshToken}`,
          },
          ...options,
        });
      } else
        showToast(
          "error",
          "Error",
          requestRes.status === 403
            ? "You need Permission!"
            : typeof json.message === "object"
            ? json.message[0]
            : json.message
        );
      return false;
    } catch (err) {
      console.log(err);
    }
  };

  const RequestAccessToken = async () => {
    try {
      const requestRes = await fetch(`${config.host}/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });

      const accessToken = await requestRes.json();
      if (accessToken && accessToken.success) {
        setToken(accessToken.data);
        return accessToken.data;
      }
      return showToast("error", "Error", accessToken.message);
    } catch (err) {
      console.log(err);
    }
  };

  return { RequestApi, RequestAccessToken };
}
