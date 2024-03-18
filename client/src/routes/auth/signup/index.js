import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext } from "react";
import { AuthContext } from "../../../context/auth.context";
import { ToastContext } from "../../../context/toast.context";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import FormSection from "../../../component/form";
import { Calendar } from "primereact/calendar";
import useRequestApi from "../../../hooks/useRequestApi";
import env from "react-dotenv";

export default function SignupRoute() {
  const { authForm, handleChangeAuthForm } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const { RequestApi } = useRequestApi();
  const navigate = useNavigate();
  const Gender = [
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Others", code: "O" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { gender, ...form } = authForm;
    let signupRes = await RequestApi({
      method: "POST",
      path: "auth/signup",
      data: {
        ...form,
        gender: gender ? gender.code : "",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (signupRes) showToast("success", "Success", "Signup successful!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-6 flex flex-column gap-4">
        <FormSection isRequired heading="Fullname">
          <span className="p-float-label">
            <InputText
              id="firstname"
              value={authForm.firstname || ""}
              onChange={(e) =>
                handleChangeAuthForm("firstname", e.target.value)
              }
            />
            <label htmlFor="firstname">Firstname</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="lastname"
              value={authForm.lastname || ""}
              onChange={(e) => handleChangeAuthForm("lastname", e.target.value)}
            />
            <label htmlFor="lastname">Lastname</label>
          </span>
        </FormSection>

        <FormSection isRequired heading="Account">
          <div>
            <span className="p-float-label w-full md:w-14rem">
              <Dropdown
                inputId="dd-gender"
                options={Gender}
                optionLabel="name"
                className="w-full"
                value={authForm.gender || ""}
                onChange={(e) => handleChangeAuthForm("gender", e.target.value)}
              />
              <label htmlFor="dd-gender">Gender</label>
            </span>
            <span className="p-float-label">
              <Calendar
                inputId="birth_date"
                dateFormat="dd/mm/yy"
                value={authForm.birthday || ""}
                onChange={(e) =>
                  handleChangeAuthForm("birthday", e.target.value)
                }
              />
              <label htmlFor="birth_date">Birth Date</label>
            </span>

            <span className="p-float-label w-full">
              <InputText
                id="username"
                value={authForm.username || ""}
                onChange={(e) =>
                  handleChangeAuthForm("username", e.target.value)
                }
              />
              <label htmlFor="username">Username</label>
            </span>

            <span className="p-float-label w-full">
              <Password
                id="password"
                value={authForm.password || ""}
                onChange={(e) =>
                  handleChangeAuthForm("password", e.target.value)
                }
              />
              <label htmlFor="password">Password</label>
            </span>
          </div>
        </FormSection>

        <Button label="Signup" type="submit" className="p-button-info" />
      </form>
      <Button
        label="Login"
        className="p-button-info"
        link
        onClick={() => navigate("/login")}
      />
    </div>
  );
}
