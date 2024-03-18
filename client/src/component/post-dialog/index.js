import { useContext } from "react";
import { InputText } from "primereact/inputtext";
import useRequestApi from "../../hooks/useRequestApi";
import UseToken from "../../hooks/useToken";
import { ToastContext } from "../../context/toast.context";
import { PostDialogContext } from "../../context/posts-dialog.context";
import DialogForm from "../dialog-form";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";

export default function PostDialog({ ...props }) {
  const { post, change, clear } = useContext(PostDialogContext);
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
      path: `post`,
      data: {
        content: post.content,
        title: post.title,
        id: post.id,
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
      path: `post`,
      data: post,
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
    <DialogForm
      onClose={closeDialog}
      onConfirm={post && post.id ? onConfirmEdit : onConfirmCreate}
      {...props}
    >
      <div>
        <span className="p-float-label">
          <InputText
            id="title"
            value={post.title}
            onChange={(e) => change("title", e.target.value)}
          />
          <label htmlFor="title">Title</label>
        </span>
        <span className="p-float-label">
          <InputTextarea
            id="content"
            value={post.content}
            onChange={(e) => change("content", e.target.value)}
          />
          <label htmlFor="content">Content</label>
        </span>
        <span className="p-float-label">
          <label htmlFor="content">Content</label>
          <FileUpload
            mode="basic"
            name="file"
            url="/api/upload"
            accept="image/*"
            maxFileSize={500000}
          />
        </span>
      </div>
    </DialogForm>
  );
}
