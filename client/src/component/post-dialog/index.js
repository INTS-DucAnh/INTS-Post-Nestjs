import { useContext, useEffect, useState } from "react";
import useRequestApi from "../../hooks/useRequestApi";
import UseToken from "../../hooks/useToken";
import { ToastContext } from "../../context/toast.context";
import { PostDialogContext } from "../../context/posts-dialog.context";
import DialogForm from "../dialog-form";
import FormHolder from "../form";
import { PostFormFields } from "./form.fields";

export default function PostDialog({ ...props }) {
  const [categories, SetCategories] = useState([]);
  const [skip, SetSkip] = useState(0);
  const [max, SetMax] = useState(0);
  const [limit, SetLimit] = useState(10);
  const { post, change, clear } = useContext(PostDialogContext);
  const { RequestApi } = useRequestApi();
  const { showToast } = useContext(ToastContext);
  const disableField = {
    create: [""],
    update: [""],
  };

  const getCategories = () => {
    RequestApi({
      method: "GET",
      path: `category?skip=${skip}&limit=${limit}`,
    }).then((res) => {
      if (res) {
        SetCategories(res.data.categories);
        SetMax(res.data.count);
      }
    });
  };

  const closeDialog = () => {
    post.thumbnails && deleteImage(post.thumbnails.filter((_, id) => id !== 0));
    props.onClose();
  };

  const onConfirmEdit = async () => {
    const prevAva = post.thumbnails ? post.thumbnails[0] : post.avatar;

    await RequestApi({
      method: "PUT",
      path: `post`,
      data: {
        content: post.content,
        title: post.title,
        id: post.id,
        thumbnail: post.thumbnail,
        categories: post.categories
          ? post.categories.map((e) => {
              if (e.id) return e.id;
              return e.code;
            })
          : [],
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res) {
        if (post.thumbnails && prevAva) deleteImage([prevAva]);
        showToast("success", "Successfully", "Updated Post");
        props.onClose();
      }
    });
  };

  const onConfirmCreate = async () => {
    const { categories, ...postData } = post;
    const prevAva = post.thumbnails ? post.thumbnails[0] : post.avatar;
    await RequestApi({
      method: "POST",
      path: `post`,
      data: {
        ...postData,
        categories: categories
          ? categories.map((e) => {
              if (e.id) return e.id;
              return e.code;
            })
          : [],
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res) {
        if (post.thumbnails && prevAva) deleteImage([prevAva]);
        showToast("success", "Successfully", "Created Category");
        closeDialog();
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

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <DialogForm
      {...props}
      onClose={closeDialog}
      onConfirm={post && post.id ? onConfirmEdit : onConfirmCreate}
      style={{ width: "600px", maxHeight: "95%" }}
    >
      <FormHolder
        formFields={PostFormFields}
        disableField={disableField[props.type || "update"]}
        data={post}
        change={change}
        extraDataField={{
          categories: {
            options: categories,
          },
        }}
      />
    </DialogForm>
  );
}
