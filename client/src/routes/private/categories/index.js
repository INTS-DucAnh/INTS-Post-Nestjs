import { DataTable } from "primereact/datatable";
import SectionContent from "../../../component/section";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useRequestApi from "../../../hooks/useRequestApi";
import UseToken from "../../../hooks/useToken";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import {
  TempalteUserDetail,
  TemplateUser,
  TemplateUserImage,
} from "../dashboard/styled";

export default function CategoryRoute() {
  const [list, SetList] = useState([]);
  const [limit, SetLimit] = useState(10);
  const [skip, SetSkip] = useState(0);
  const [max, SetMax] = useState(0);
  const { getToken } = UseToken();
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

  useEffect(() => {
    getListCategory();
  }, []);

  return (
    <div>
      <SectionContent title={"Category"}>
        <TableOfCategory list={list} />
        <div>
          <Paginator
            totalRecords={max}
            rows={limit}
            onPageChange={(page) => SetSkip(page.first)}
          />
        </div>
      </SectionContent>
    </div>
  );
}
function TableOfCategory({ list }) {
  const templateCreateBy = (category) => {
    return (
      <TemplateUser>
        <TemplateUserImage>
          {category.usersUpdate.avatar ? (
            <img alt="user img" src={category.usersUpdate.avatar} />
          ) : (
            <p>
              {category.usersUpdate.firstname[0].toUpperCase()}
              {category.usersUpdate.lastname[0].toUpperCase()}
            </p>
          )}
        </TemplateUserImage>
        <TempalteUserDetail>
          <p>{category.usersUpdate.username}</p>
        </TempalteUserDetail>
      </TemplateUser>
    );
  };

  const templateUpdateBy = (category) => {
    return (
      <TemplateUser>
        <TemplateUserImage>
          {category.usersCreate.avatar ? (
            <img alt="user img" src={category.usersCreate.avatar} />
          ) : (
            <p>
              {category.usersCreate.firstname[0].toUpperCase()}
              {category.usersCreate.lastname[0].toUpperCase()}
            </p>
          )}
        </TemplateUserImage>
        <TempalteUserDetail>
          <p>{category.usersCreate.username}</p>
        </TempalteUserDetail>
      </TemplateUser>
    );
  };

  const templateCreateDate = (category) => {
    return (
      <div>
        <p>{new Date(category.createat).toLocaleString()}</p>
      </div>
    );
  };
  const templateUpdateDate = (category) => {
    return (
      <div>
        <p>{new Date(category.updateat).toLocaleString()}</p>
      </div>
    );
  };

  const templateAction = (category) => {
    return (
      <div>
        <Button label="Edit" icon="pi pi-pencil" />
        <Button label="Delete" icon="pi pi-trash" outlined />
      </div>
    );
  };
  return (
    <div>
      <DataTable value={list} showGridlines stripedRows>
        <Column field="id" header="ID"></Column>
        <Column field="title" header="Title"></Column>
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
        <Column header="Action" body={templateAction}></Column>
      </DataTable>
    </div>
  );
}
