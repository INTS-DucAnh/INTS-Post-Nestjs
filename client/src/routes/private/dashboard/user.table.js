import { Column } from "primereact/column";
import {
  GenderTemplate,
  RoleTitleTemplate,
  UserFullNameTemplate,
  UserTemplate,
  templateAction,
} from "../../../component/table/table.template";
import DisplayTable from "../../../component/table";

export default function TableOfUser({
  users,
  max,
  limit,
  skip,
  onDelete,
  onEdit,
  onPageChange,
  ...props
}) {
  return (
    <DisplayTable
      list={users}
      max={max}
      limit={limit}
      skip={skip}
      onPageChange={onPageChange}
    >
      <Column header="User" body={UserTemplate}></Column>
      <Column header="Name" body={UserFullNameTemplate}></Column>
      <Column header="Gender" body={GenderTemplate}></Column>
      <Column header="Role" body={RoleTitleTemplate}></Column>
      <Column
        header="Action"
        body={(category) => templateAction(category, onEdit, onDelete)}
        style={{ width: "200px" }}
      ></Column>
    </DisplayTable>
  );
}
