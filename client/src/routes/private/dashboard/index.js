import { useEffect, useState } from "react";
import SectionContent from "../../../component/section";
import useRequestApi from "../../../hooks/useRequestApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import UseToken from "../../../hooks/useToken";
import {
  TempalteUserDetail,
  TemplateGender,
  TemplateRole,
  TemplateUser,
  TemplateUserImage,
} from "./styled";

export default function DashboardRoute() {
  const { getToken } = UseToken();
  const [list, SetList] = useState([]);
  const [skip, SetSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [max, SetMax] = useState(0);
  const { RequestApi } = useRequestApi();

  const getListUser = () => {
    RequestApi({
      method: "GET",
      path: `user/find?limit=${limit}&skip=${skip}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      if (res) {
        SetList(res.data.users);
        SetMax(res.data.max);
      }
    });
  };

  useEffect(() => {
    getListUser();
  }, [skip, limit]);

  return (
    <div>
      <SectionContent title={"Users"}>
        <TableOfUser users={list} />
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

function TableOfUser({ users, ...props }) {
  const Gender = {
    M: {
      display: "Male",
    },
    F: {
      display: "Female",
    },
    O: {
      display: "Others",
    },
  };

  const UserTemplate = (user) => {
    return (
      <TemplateUser>
        <TemplateUserImage>
          {user.avatar ? (
            <img alt="user img" src={user.avatar} />
          ) : (
            <p>
              {user.firstname[0].toUpperCase()}
              {user.lastname[0].toUpperCase()}
            </p>
          )}
        </TemplateUserImage>
        <TempalteUserDetail>
          <p>{user.username}</p>
        </TempalteUserDetail>
      </TemplateUser>
    );
  };

  const UserFullNameTemplate = (user) => {
    return (
      <p>
        {user.firstname} {user.lastname}
      </p>
    );
  };

  const RoleTitleTemplate = (user) => {
    return (
      <TemplateRole className={user.roles.title.toLowerCase()}>
        <p>{user.roles.title}</p>
      </TemplateRole>
    );
  };

  const GenderTemplate = (user) => {
    return (
      <TemplateGender className={user.gender.toLowerCase()}>
        <p>{Gender[user.gender].display}</p>
      </TemplateGender>
    );
  };

  return (
    <div>
      <DataTable value={users} showGridlines stripedRows>
        <Column field="id" header="ID"></Column>
        <Column header="User" body={UserTemplate}></Column>
        <Column header="Name" body={UserFullNameTemplate}></Column>
        <Column header="Gender" body={GenderTemplate}></Column>
        <Column header="Role" body={RoleTitleTemplate}></Column>
      </DataTable>
    </div>
  );
}
