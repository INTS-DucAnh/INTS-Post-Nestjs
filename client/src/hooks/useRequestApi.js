import { useContext } from "react";
import { ToastContext } from "../context/toast.context";
import env from "react-dotenv";
import UseToken from "./useToken";

export const config = {
  host: env.REACT_APP_BACKEND_HOST,
};

export default function useRequestApi() {
  const { showToast } = useContext(ToastContext);
  const { setToken, getToken } = UseToken();

  const RequestApi = async ({
    method,
    path,
    data = {},
    formdata = null,
    ...props
  }) => {
    try {
      const { headers, ...options } = props;
      const requestRes = await fetch(`${config.host}/${path}`, {
        method: method,
        ...(method !== "GET"
          ? { body: !formdata ? JSON.stringify(data) : formdata }
          : {}),
        credentials: "include",
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const json = await requestRes.json();
      if (json && json.success) {
        return json;
      } else if (requestRes.status === 401 && json.message === "Unauthorized") {
        await RequestAccessToken();

        return await RequestApi({
          method,
          path,
          data,
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
            : json.message || "Some thing wrong"
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
      }
      return showToast("error", "Error", accessToken.message);
    } catch (err) {
      console.log(err);
    }
  };

  return { RequestApi, RequestAccessToken };
}
