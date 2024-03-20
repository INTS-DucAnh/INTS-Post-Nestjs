import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UserDialogContext } from "../../context/user-dialog.context";
import useRequestApi from "../../hooks/useRequestApi";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../context/toast.context";
import FormHolder from "../form/index";
import { UserFormFields } from "./form.fields";
import DialogForm from "../dialog-form";

export default function UserDialog({ ...props }) {
  const { data, change } = useContext(UserDialogContext);
  const { RequestApi } = useRequestApi();
  const { showToast } = useContext(ToastContext);
  const [roles, SetListRole] = useState([]);
  const disableField = {
    create: [""],
    update: ["username"],
  };

  const closeDialog = () => {
    data.avatars && deleteImage(data.avatars.filter((_, id) => id !== 0));
    props.onClose();
  };

  const onConfirmEdit = async () => {
    const prevAva = data.avatars ? data.avatars[0] : data.avatar;
    const { gender, roles, ...user } = data;
    if (!user.password) delete user.password;
    RequestApi({
      method: "PUT",
      path: `user/${data.id}`,
      data: {
        ...user,
        roleid: typeof roles === "number" ? roles : roles.code,
        gender: typeof gender === "string" ? gender : gender.code,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res) {
        if (data.avatars && prevAva) deleteImage([prevAva]);
        showToast("success", "Successfully", "Updated User");
        props.onClose();
      }
    });
  };

  const onConfirmCreate = async () => {
    const prevAva = data.avatars ? data.avatars[0] : data.avatar;
    const { gender, roles, ...user } = data;
    await RequestApi({
      method: "POST",
      path: `auth/create`,
      data: {
        ...user,
        ...(roles
          ? { roleid: typeof roles === "number" ? roles : roles.code }
          : {}),
        ...(gender
          ? { gender: typeof gender === "string" ? gender : gender.code }
          : {}),
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res) {
        if (data.avatars && prevAva) deleteImage([prevAva]);
        showToast("success", "Successfully", "Created User");
        props.onClose();
      }
    });
  };

  const deleteImage = async (images) => {
    if (!images) return;
    const deleteSessionImage = await Promise.all(
      images.map((i) =>
        RequestApi({
          method: "DELETE",
          path: `post/s3-delete?file=${i}`,
        })
      )
    );
    return deleteSessionImage;
  };

  const getListRole = async () => {
    RequestApi({
      method: "GET",
      path: "role",
    }).then((res) => {
      if (res) {
        SetListRole(res.data);
      }
    });
  };

  useEffect(() => {
    getListRole();
  }, []);

  return (
    <DialogForm
      {...props}
      onClose={closeDialog}
      onConfirm={data && data.id ? onConfirmEdit : onConfirmCreate}
      style={{ width: "600px" }}
    >
      <FormHolder
        formFields={UserFormFields}
        disableField={disableField[props.type]}
        data={data}
        change={change}
        extraDataField={{
          roleid: {
            options: roles,
          },
        }}
      />
    </DialogForm>
  );
}
