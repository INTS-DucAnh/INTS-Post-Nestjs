import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";

export default function DisplayTable({
  list,
  max,
  limit,
  skip,
  onPageChange,
  children,
  ...props
}) {
  return (
    <div>
      <ConfirmDialog />
      <DataTable value={list} showGridlines stripedRows {...props}>
        <Column
          field="id"
          header="ID"
          style={{ width: "30px", fontWeight: "bold", textAlign: "center" }}
        ></Column>
        {children}
      </DataTable>

      <div>
        <Paginator
          totalRecords={max}
          first={skip}
          rows={limit}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
