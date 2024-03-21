import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UserDialogContext } from "../../context/user-dialog.context";
import useRequestApi from "../../hooks/useRequestApi";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../context/toast.context";
import FormHolder from "../form/index";
import { UserFormFields } from "./form.fields";
import DialogForm from "../dialog-form";
import { ToastSuccess } from "../../utils/toast.contstant";
import { MESSAGE_CONSTANT } from "../../utils/default.constant";
import { v4 as uuidv4 } from "uuid";

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

  const processTempImages = async () => {
    const { gender, roles, ...user } = data;
    let avatar = user.avatar || "";
    let session = uuidv4();

    if (user._temp) {
      let temp = new File([user._temp], session, { type: user._temp.type });
      delete user._temp;
      delete user._prev;

      const newAvatar = await uploadImage([temp]);
      avatar = newAvatar[0].data.url;
    }
    return { avatar, user, gender, roles, session };
  };

  const onConfirmEdit = async () => {
    if (data._prev) {
      const host = data._prev.split("/");
      await deleteImage([host.pop()]);
    }
    const { avatar, user, gender, roles, session } = await processTempImages();

    await RequestApi({
      method: "PUT",
      path: `user/${data.id}`,
      data: {
        ...user,
        avatar,
        roleid: typeof roles === "number" ? roles : roles.code,
        gender: typeof gender === "string" ? gender : gender.code,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res) {
        showToast(ToastSuccess(MESSAGE_CONSTANT.user.updated.success));
        props.onClose();
      } else {
        deleteImage([session]);
      }
    });
  };

  const onConfirmCreate = async () => {
    const { avatar, user, gender, roles, session } = await processTempImages();

    await RequestApi({
      method: "POST",
      path: `auth/create`,
      data: {
        ...user,
        avatar,
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
        showToast(ToastSuccess(MESSAGE_CONSTANT.post.created.success));
        props.onClose();
      } else {
        deleteImage([session]);
      }
    });
  };

  const deleteImage = async (images) => {
    if (!images) return;
    const deletedImage = await Promise.all(
      images.map((i) =>
        RequestApi({
          method: "DELETE",
          path: `post/s3-delete?file=${i}`,
        })
      )
    );
    return deletedImage;
  };

  const uploadImage = async (images) => {
    if (!images) return;
    const uploadedImage = await Promise.all(
      images.map((i) => {
        const form = new FormData();
        form.append("image", i);

        return RequestApi({
          method: "POST",
          path: `post/s3-upload`,
          formdata: form,
        });
      })
    );
    return uploadedImage;
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
