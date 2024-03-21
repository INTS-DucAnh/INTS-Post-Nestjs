import SectionContent from "../../../component/section";
import { useContext, useEffect, useState } from "react";
import useRequestApi from "../../../hooks/useRequestApi";
import UseToken from "../../../hooks/useToken";
import TableOfCategory from "./category.table";
import CategoryDialog from "../../../component/category-dialog";
import { CategoryDialogContext } from "../../../context/category-dialog.context";
import { ToastContext } from "../../../context/toast.context";
import { ToastSuccess } from "../../../utils/toast.contstant";
import { MESSAGE_CONSTANT } from "../../../utils/default.constant";

export default function CategoryRoute() {
  const [list, SetList] = useState([]);
  const [limit, SetLimit] = useState(10);
  const [skip, SetSkip] = useState(0);
  const [max, SetMax] = useState(0);
  const [visibleDialog, SetVisibleDialog] = useState(false);
  const { set, clear } = useContext(CategoryDialogContext);
  const { getToken } = UseToken();
  const { showToast } = useContext(ToastContext);
  const { RequestApi } = useRequestApi();

  const getListCategory = () => {
    RequestApi({
      method: "GET",
      path: `category?limit=${limit}&skip=${skip}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        SetList(res.data.categories);
        SetMax(res.data.count);
      }
    });
  };

  const onDelete = async (category) => {
    await RequestApi({
      method: "DELETE",
      path: `category/${category.id}`,
    }).then((res) => {
      if (res) {
        SetList((list) => list.filter((e) => e.od !== category.id));
        showToast(ToastSuccess(MESSAGE_CONSTANT.category.deleted.success));
      }
    });
  };

  const onEdit = async (category) => {
    RequestApi({
      method: "GET",
      path: `category/${category.id}`,
    }).then((res) => {
      if (res) {
        SetVisibleDialog(true);
        set(res.data);
      }
    });
  };

  useEffect(() => {
    getListCategory();
  }, []);

  return (
    <div>
      <SectionContent
        title={"Category"}
        onSelectCreate={() => SetVisibleDialog(true)}
        onRefresh={() => getListCategory()}
      >
        <CategoryDialog
          header="Category"
          style={{ width: "300px" }}
          visible={visibleDialog}
          onClose={() => {
            SetVisibleDialog(false);
            clear();
          }}
        />
        <TableOfCategory
          list={list}
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
