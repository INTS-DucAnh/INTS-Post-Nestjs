import { useContext, useEffect, useState } from "react";
import useRequestApi from "../../hooks/useRequestApi";
import { ToastContext } from "../../context/toast.context";
import { PostDialogContext } from "../../context/posts-dialog.context";
import DialogForm from "../dialog-form";
import FormHolder from "../form";
import { PostFormFields } from "./form.fields";
import { ToastSuccess } from "../../utils/toast.contstant";
import { v4 as uuidv4 } from "uuid";

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

  const processTempImages = async () => {
    let thumbnail = post.thumbnail || "";
    let session = uuidv4();

    if (post._temp) {
      let temp = new File([post._temp], session, { type: post._temp.type });
      delete post._temp;
      delete post._prev;

      const newThumbnail = await uploadImage([temp]);
      thumbnail = newThumbnail[0].data.url;
    }

    return {
      thumbnail,
      session,
      categories: post.categories,
      content: post.content,
      title: post.title,
    };
  };

  const onConfirmEdit = async () => {
    if (post._prev) {
      const host = post._prev.split("/");
      await deleteImage([host.pop()]);
    }
    const { thumbnail, session } = await processTempImages();

    await RequestApi({
      method: "PUT",
      path: `post`,
      data: {
        content: post.content,
        title: post.title,
        id: post.id,
        thumbnail: thumbnail,
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
        showToast(ToastSuccess("Updated Post"));
        props.onClose();
      } else {
        deleteImage([session]);
      }
    });
  };

  const onConfirmCreate = async () => {
    const { thumbnail, session, categories, ...postData } =
      await processTempImages();

    console.log({ thumbnail, session, categories, ...postData });

    await RequestApi({
      method: "POST",
      path: `post`,
      data: {
        ...postData,
        thumbnail,
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
        showToast(ToastSuccess("Created Category"));
        closeDialog();
      } else {
        deleteImage([session]);
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
