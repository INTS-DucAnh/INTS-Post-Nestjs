import { Paginator } from "primereact/paginator";
import SectionContent from "../../../component/section";
import TableOfPosts from "./posts.table";
import { useContext, useEffect, useState } from "react";
import useRequestApi from "../../../hooks/useRequestApi";
import PostDialog from "../../../component/post-dialog";
import { PostDialogContext } from "../../../context/posts-dialog.context";
import UseToken from "../../../hooks/useToken";
import { ToastContext } from "../../../context/toast.context";
import { ToastSuccess } from "../../../utils/toast.contstant";
import { MESSAGE_CONSTANT } from "../../../utils/default.constant";

export default function PostRoute() {
  const [posts, SetPosts] = useState([]);
  const [limit, SetLimit] = useState(10);
  const [skip, SetSkip] = useState(0);
  const [max, SetMax] = useState(0);
  const [visibleDialog, SetVisibleDialog] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { getToken } = UseToken();
  const { clear, set } = useContext(PostDialogContext);
  const { RequestApi } = useRequestApi();

  const getPosts = () => {
    RequestApi({
      method: "GET",
      path: `post/find?limit=${limit}&skip=${skip}`,
      accessToken: true,
    }).then((res) => {
      if (res) {
        SetPosts(res.data.posts);
        SetMax(res.data.max);
      }
    });
  };

  const onEdit = async (post) => {
    RequestApi({
      method: "GET",
      path: `post/${post.id}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        SetVisibleDialog(true);
        set(res.data);
      }
    });
  };

  const onDelete = (post) => {
    RequestApi({
      method: "DELETE",
      path: `post?id=${post.id}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        showToast(ToastSuccess(MESSAGE_CONSTANT.post.deleted.success));
        clear();
      }
    });
  };
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <SectionContent
        title={"Posts"}
        onSelectCreate={() => SetVisibleDialog(true)}
        onRefresh={() => getPosts()}
      >
        <PostDialog
          header="Post"
          visible={visibleDialog}
          onClose={() => {
            SetVisibleDialog(false);
            clear();
          }}
        />
        <TableOfPosts
          posts={posts}
          onDelete={onDelete}
          onEdit={onEdit}
          max={max}
          limit={limit}
          skip={skip}
          onPageChange={(page) => SetSkip(page.first)}
        />
      </SectionContent>
    </div>
  );
}
