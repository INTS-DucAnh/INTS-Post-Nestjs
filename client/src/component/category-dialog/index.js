import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useContext } from "react";
import { CategoryDialogContext } from "../../context/category-dialog.context";
import { InputText } from "primereact/inputtext";
import useRequestApi from "../../hooks/useRequestApi";
import UseToken from "../../hooks/useToken";
import { ToastContext } from "../../context/toast.context";

export default function CategoryDialog({ ...props }) {
  const { category, change, clear } = useContext(CategoryDialogContext);
  const { RequestApi } = useRequestApi();
  const { getToken } = UseToken();
  const { showToast } = useContext(ToastContext);
  const closeDialog = () => {
    clear();
    props.onClose();
  };

  const onConfirmEdit = async () => {
    await RequestApi({
      method: "PUT",
      path: `category`,
      data: {
        title: category.title,
        id: category.id,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        showToast("success", "Successfully", "Updated Category");
        closeDialog();
      }
    });
  };

  const onConfirmCreate = async () => {
    await RequestApi({
      method: "POST",
      path: `category`,
      data: {
        title: category.title,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        showToast("success", "Successfully", "Created Category");
        closeDialog();
      }
    });
  };

  return (
    <Dialog onHide={closeDialog} {...props}>
      <div>
        <span className="p-float-label">
          <InputText
            id="categorytitle"
            value={category.title}
            onChange={(e) => change("title", e.target.value)}
          />
          <label htmlFor="categorytitle">Title</label>
        </span>
      </div>
      <div>
        <Button text label="Cancel" onClick={closeDialog} />
        <Button
          label="Confirm"
          onClick={category.id ? onConfirmEdit : onConfirmCreate}
        />
      </div>
    </Dialog>
  );
}
