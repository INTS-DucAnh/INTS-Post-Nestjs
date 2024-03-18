import { Column } from "primereact/column";
import DisplayTable from "../../../component/table";
import {
  TemplateCategories,
  TemplateImage,
  templateAction,
  templateCreateBy,
  templateCreateDate,
  templateUpdateBy,
  templateUpdateDate,
} from "../../../component/table/table.template";

export default function TableOfPosts({
  posts,
  onDelete,
  onEdit,
  skip,
  limit,
  max,
}) {
  return (
    <DisplayTable list={posts} skip={skip} limit={limit} max={max}>
      <Column
        header="Thumbnail"
        body={(post) => TemplateImage(post.thumbnail)}
      />
      <Column header="Create By" body={templateCreateBy} />
      <Column header="Create At" body={templateCreateDate} />
      <Column header="Update By" body={templateUpdateBy} />
      <Column header="Update At" body={templateUpdateDate} />
      <Column
        header="Categories"
        body={(post) => TemplateCategories(post.categories)}
      />
      <Column
        header="Actions"
        body={(post) => templateAction(post, onEdit, onDelete)}
        style={{ width: "200px" }}
      />
    </DisplayTable>
  );
}
