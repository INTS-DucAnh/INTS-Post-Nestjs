import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth.context";
import { ToastContext } from "../../../context/toast.context";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import UseToken from "../../../hooks/useToken";
import useRequestApi from "../../../hooks/useRequestApi";

export default function LoginRoute() {
  const { authForm, handleChangeAuthForm } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const { setToken } = UseToken();
  const { RequestApi } = useRequestApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let loginRes = await RequestApi({
      method: "POST",
      path: "auth/login",
      data: {
        username: authForm.username || "",
        password: authForm.password || "",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (loginRes) {
      showToast("success", "Success", "Login successful!");
      setToken(loginRes.data);
      navigate("/");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-2 align-items-center">
          <label htmlFor="username">Username</label>
          <InputText
            placeholder="Username"
            value={authForm.username || ""}
            onChange={(e) => handleChangeAuthForm("username", e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-2 align-items-center">
          <label htmlFor="username">Password</label>
          <Password
            placeholder="Password"
            value={authForm.password || ""}
            onChange={(e) => handleChangeAuthForm("password", e.target.value)}
            feedback={false}
          />
        </div>

        <Button label="Login" type="submit" className="p-button-info" />
      </form>
      <Button
        label="Signup"
        className="p-button-info"
        link
        onClick={() => navigate("/signup")}
      />
    </div>
  );
}
