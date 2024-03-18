import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UserDialogContext } from "../../context/user-dialog.context";
import useRequestApi from "../../hooks/useRequestApi";
import UseToken from "../../hooks/useToken";
import { useContext } from "react";
import { ToastContext } from "../../context/toast.context";

export default function UserDialog({ ...props }) {
  const { user, change, clear } = useContext(UserDialogContext);
  const { RequestApi } = useRequestApi();
  const { getToken } = UseToken();
  const { showToast } = useContext(ToastContext);

  const closeDialog = () => {
    clear();
    props.onClose();
  };

  const onConfirmEdit = async () => {
    // await RequestApi({
    //   method: "PUT",
    //   path: `category`,
    //   data: {},
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${getToken()}`,
    //   },
    // }).then((res) => {
    //   if (res) {
    showToast("success", "Successfully", "Updated User");
    closeDialog();
    //   }
    // });
  };

  const onConfirmCreate = async () => {
    // await RequestApi({
    //   method: "POST",
    //   path: `category`,
    //   data: {},
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${getToken()}`,
    //   },
    // }).then((res) => {
    //   if (res) {
    showToast("success", "Successfully", "Created User");
    closeDialog();
    //   }
    // });
  };
  return (
    <Dialog onHide={closeDialog} {...props}>
      <div>
        <span className="p-float-label">
          <InputText
            id="categorytitle"
            // value={category.title}
            // onChange={(e) => changData("title", e.target.value)}
          />
          <label htmlFor="categorytitle">Title</label>
        </span>
      </div>
      <div>
        <Button text label="Cancel" onClick={closeDialog} />
        <Button
          label="Confirm"
          onClick={user.id ? onConfirmEdit : onConfirmCreate}
        />
      </div>
    </Dialog>
  );
}
