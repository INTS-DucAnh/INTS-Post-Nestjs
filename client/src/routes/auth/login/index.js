import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth.context";
import { ToastContext } from "../../../context/toast.context";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import UseToken from "../../../hooks/useToken";
import useRequestApi from "../../../hooks/useRequestApi";
import { Image } from "primereact/image";
import { ImageForm, LoginForm, LoginFormHolder, LoginMainForm } from "./styled";

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
    <LoginFormHolder>
      <LoginForm onSubmit={handleSubmit}>
        <ImageForm>
          <Image src="https://img.freepik.com/free-vector/dark-green-background-design_1107-162.jpg?t=st=1710926687~exp=1710930287~hmac=2395d43d8887fb9a561a849dd53c59e71ed966bc2804bf855bf07ccfb021517b&w=826" />
        </ImageForm>
        <LoginMainForm>
          <h1>Login</h1>
          <div className="">
            <label htmlFor="username">Username</label>
            <InputText
              placeholder="Username"
              value={authForm.username || ""}
              onChange={(e) => handleChangeAuthForm("username", e.target.value)}
            />
          </div>
          <div className="">
            <label htmlFor="username">Password</label>
            <Password
              placeholder="Password"
              value={authForm.password || ""}
              onChange={(e) => handleChangeAuthForm("password", e.target.value)}
              feedback={false}
              toggleMask
            />
          </div>

          <Button label="Login" type="submit" className="p-button-info" />
        </LoginMainForm>
      </LoginForm>
      {/* <Button
        label="Signup"
        className="p-button-info"
        link
        onClick={() => navigate("/signup")}
      /> */}
    </LoginFormHolder>
  );
}
