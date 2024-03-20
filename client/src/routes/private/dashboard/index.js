import { useContext, useEffect, useState } from "react";
import SectionContent from "../../../component/section";
import useRequestApi from "../../../hooks/useRequestApi";
import UseToken from "../../../hooks/useToken";
import TableOfUser from "./user.table";
import UserDialog from "../../../component/user-dialog";
import { UserDialogContext } from "../../../context/user-dialog.context";
import { ToastContext } from "../../../context/toast.context";

export default function DashboardRoute() {
  const [list, SetList] = useState([]);
  const [skip, SetSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [max, SetMax] = useState(0);
  const [visible, SetVisible] = useState(false);
  const [typeDialog, SetTypeDialog] = useState("");
  const { clear, set } = useContext(UserDialogContext);
  const { showToast } = useContext(ToastContext);
  const { RequestApi } = useRequestApi();

  const getListUser = () => {
    RequestApi({
      method: "GET",
      path: `user/find?limit=${limit}&skip=${skip}`,
    }).then((res) => {
      if (res) {
        SetList(res.data.users);
        SetMax(res.data.max);
      }
    });
  };

  const onDelete = async (user) => {
    RequestApi({
      method: "DELETE",
      path: `user/${user.id}`,
    }).then((res) => {
      if (res) {
        clear();
        showToast("success", "Successful", "Deleted a user");
      }
    });
  };

  const onEdit = async (user) => {
    RequestApi({
      method: "GET",
      path: `user/${user.id}`,
    }).then((res) => {
      if (res) {
        SetVisible(true);
        SetTypeDialog("update");
        set(res.data);
      }
    });
  };

  useEffect(() => {
    getListUser();
  }, [skip, limit]);

  return (
    <div>
      <SectionContent
        title={"Users"}
        onRefresh={() => getListUser()}
        onSelectCreate={() => {
          SetVisible(true);
          SetTypeDialog("create");
        }}
      >
        <UserDialog
          header="User"
          visible={visible}
          type={typeDialog}
          onClose={() => {
            SetVisible(false);
            clear();
          }}
        />
        <TableOfUser
          users={list}
          max={max}
          limit={limit}
          skip={skip}
          onDelete={onDelete}
          onEdit={onEdit}
          onPageChange={(page) => SetSkip(page.first)}
        />
      </SectionContent>
    </div>
  );
}
