import { useContext, useState } from "react";
import { ToastContext } from "../context/toast.context";
import env from "react-dotenv";
import UseToken from "./useToken";
import { ToastError } from "../utils/toast.contstant";
import { MESSAGE_CONSTANT } from "../utils/default.constant";

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
    recall = true,
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
      } else {
        if (
          requestRes.status === 401 &&
          json.message === "Unauthorized" &&
          recall
        ) {
          await RequestAccessToken();

          return await RequestApi({
            method,
            path,
            data,
            formdata,
            recall: false,
            ...options,
          });
        }

        showToast(
          ToastError(
            typeof json.message === "object"
              ? json.message[0]
              : MESSAGE_CONSTANT.err(json.message)[requestRes.status]
          )
        );
      }
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
        return setToken(accessToken.data);
      }
      return showToast(ToastError(accessToken.message));
    } catch (err) {
      console.log(err);
    }
  };

  return { RequestApi, RequestAccessToken };
}
