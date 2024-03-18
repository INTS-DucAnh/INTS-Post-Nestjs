import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import {
  TempalteUserDetail,
  TemplateGender,
  TemplateRole,
  TemplateUser,
  TemplateUserImage,
} from "../../routes/private/dashboard/styled";
import {
  CategoriesChips,
  CategoriesTemplateHolder,
  ThumbnailTemplateHolder,
} from "./styled";

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
export const templateCreateBy = (data) => {
  return (
    <TemplateUser>
      <TemplateUserImage>
        {data.usersCreate.avatar ? (
          <img alt="user img" src={data.usersCreate.avatar} />
        ) : (
          <p>
            {data.usersCreate.firstname[0].toUpperCase()}
            {data.usersCreate.lastname[0].toUpperCase()}
          </p>
        )}
      </TemplateUserImage>
      <TempalteUserDetail>
        <p>{data.usersCreate.username}</p>
      </TempalteUserDetail>
    </TemplateUser>
  );
};

export const templateUpdateBy = (data) => {
  return (
    <TemplateUser>
      <TemplateUserImage>
        {data.usersUpdate.avatar ? (
          <img alt="user img" src={data.usersUpdate.avatar} />
        ) : (
          <p>
            {data.usersUpdate.firstname[0].toUpperCase()}
            {data.usersUpdate.lastname[0].toUpperCase()}
          </p>
        )}
      </TemplateUserImage>
      <TempalteUserDetail>
        <p>{data.usersUpdate.username}</p>
      </TempalteUserDetail>
    </TemplateUser>
  );
};

export const templateCreateDate = (data) => {
  return (
    <div>
      <p>{new Date(data.createat).toLocaleString()}</p>
    </div>
  );
};

export const templateUpdateDate = (data) => {
  return (
    <div>
      <p>{new Date(data.updateat).toLocaleString()}</p>
    </div>
  );
};

export const templateAction = (data, onEdit, onDelete) => {
  const acceptEdit = () => {
    onEdit(data);
  };
  const acceptDelete = () => {
    onDelete(data);
  };
  const confirmDelete = (e) => {
    return confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: acceptDelete,
    });
  };

  return (
    <div className="w-12 flex flex-row gap-2">
      <Button
        label="Edit"
        icon="pi pi-pencil"
        className="flex-1"
        onClick={acceptEdit}
      />
      <Button
        label="Delete"
        onClick={confirmDelete}
        icon="pi pi-trash"
        className="flex-1"
        outlined
      />
    </div>
  );
};

export const RoleTitleTemplate = (user) => {
  return (
    <TemplateRole className={user.roles.title.toLowerCase()}>
      <p>{user.roles.title}</p>
    </TemplateRole>
  );
};

export const GenderTemplate = (user) => {
  return (
    <TemplateGender className={user.gender.toLowerCase()}>
      <p>{Gender[user.gender].display}</p>
    </TemplateGender>
  );
};

export const UserTemplate = (user) => {
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

export const UserFullNameTemplate = (user) => {
  return (
    <p>
      {user.firstname} {user.lastname}
    </p>
  );
};

export const TemplateImage = (src) => {
  return (
    <ThumbnailTemplateHolder>
      <img alt="data img" src={src} />
    </ThumbnailTemplateHolder>
  );
};

export const TemplateCategories = (categories) => {
  return (
    <CategoriesTemplateHolder>
      {categories.map((cate) => {
        return (
          <CategoriesChips key={cate.title}>
            <p>{cate.title}</p>
          </CategoriesChips>
        );
      })}
    </CategoriesTemplateHolder>
  );
};
