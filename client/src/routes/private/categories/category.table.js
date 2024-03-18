import { Column } from "primereact/column";
import {
  templateAction,
  templateCreateBy,
  templateCreateDate,
  templateUpdateBy,
  templateUpdateDate,
} from "../../../component/table/table.template";
import DisplayTable from "../../../component/table";

export default function TableOfCategory({
  list,
  onDelete,
  onEdit,
  max,
  limit,
  skip,
  onPageChange,
  ...props
}) {
  return (
    <DisplayTable
      list={list}
      limit={limit}
      max={max}
      skip={skip}
      onPageChange={onPageChange}
    >
      <Column
        field="title"
        header="Title"
        style={{ maxWidth: "150px" }}
      ></Column>
      <Column header="Create By" body={templateCreateBy}></Column>
      <Column
        header="Create At"
        field="createat"
        body={templateCreateDate}
      ></Column>
      <Column header="Update By" body={templateUpdateBy}></Column>
      <Column
        field="updateat"
        header="Update At"
        body={templateUpdateDate}
      ></Column>
      <Column
        header="Action"
        body={(category) => templateAction(category, onEdit, onDelete)}
        style={{ width: "200px" }}
      ></Column>
    </DisplayTable>
  );
}
