import env from "react-dotenv";

export default function UseToken() {
  const clearSTR = () => {
    return localStorage.removeItem(env.REACT_APP_LOCALSTORAGE_TOKEN_NAME);
  };
  const getLocalSTR = () =>
    JSON.parse(localStorage.getItem(env.REACT_APP_LOCALSTORAGE_TOKEN_NAME));

  const setTokenToSTR = (token) => {
    const localSTR = getLocalSTR();
    return localStorage.setItem(
      env.REACT_APP_LOCALSTORAGE_TOKEN_NAME,
      JSON.stringify({
        ...localSTR,
        token: token,
      })
    );
  };

  const getTokenFromLocalSTR = () => {
    const localSTR = getLocalSTR();

    return localSTR && localSTR.token ? localSTR.token : null;
  };

  return {
    getToken: getTokenFromLocalSTR,
    setToken: setTokenToSTR,
    clearToken: clearSTR,
  };
}
