import { useContext, useEffect, useState } from "react";
import useRequestApi from "../../../hooks/useRequestApi";
import SectionContent from "../../../component/section";
import { Button } from "primereact/button";
import { ToastContext } from "../../../context/toast.context";
import UserDialog from "../../../component/user-dialog";
import { UserDialogContext } from "../../../context/user-dialog.context";
import { InputText } from "primereact/inputtext";
import { Gender } from "../../../component/table/table.template";
import {
  AvatarFieldHolder,
  AvatarHolder,
} from "../../../component/user-dialog/form.fields";
import { Image } from "primereact/image";
import { DisplayUserInfoHolder } from "./styled";

export default function ProfileRoute() {
  const { RequestApi } = useRequestApi();
  const { data, clear, set } = useContext(UserDialogContext);
  const [user, SetUser] = useState({});
  const { showToast } = useContext(ToastContext);
  const [visible, SetVisible] = useState(false);

  const onConfirm = async () => {
    showToast("success", "Successfully", "Updated User");
  };

  const getProfile = () => {
    RequestApi({
      method: "GET",
      path: "user",
    }).then((res) => {
      if (res) {
        set(res.data);
        SetUser(res.data);
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <SectionContent title={"My Profile"} onRefresh={getProfile}>
        <UserDialog
          header="My profile"
          visible={visible}
          type={"update"}
          onClose={() => {
            SetVisible(false);
          }}
        />
        <DisplayUserInfoHolder>
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: "30px",
            }}
          >
            {Object.entries(user).map((f) => {
              let hidden = "avatar roleid id deletedat";
              let [field, data] = f;
              if (field === "gender") {
                data = Gender[data].display;
              } else if (field === "roles") {
                data = data.title;
              }
              if (!hidden.includes(field))
                return (
                  <span className="p-float-label">
                    <InputText id={field} disabled true value={data} />
                    <label
                      htmlFor={field}
                      style={{ textTransform: "capitalize" }}
                    >
                      {field}
                    </label>
                  </span>
                );
              else if (field === "avatar") {
                return (
                  <AvatarFieldHolder style={{ order: 1, margin: "30px 0" }}>
                    <AvatarHolder>
                      {data ? <Image preview src={data} /> : <p>No Avatar</p>}
                    </AvatarHolder>
                  </AvatarFieldHolder>
                );
              } else return null;
            })}
          </div>

          <div style={{ margin: "20px 0" }}>
            <Button
              label="Edit"
              icon="pi pi-pencil"
              onClick={() => SetVisible(true)}
            />
          </div>
        </DisplayUserInfoHolder>
      </SectionContent>
    </div>
  );
}
