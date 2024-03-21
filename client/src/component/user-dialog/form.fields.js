import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Image } from "primereact/image";
import { styled } from "styled-components";
import { FileUpload } from "primereact/fileupload";
import { IMAGE_CONSTANT } from "../../utils/default.constant";
import { CalSizeFile, getBase64 } from "../../utils/file.utils";
const Gender = [
  { name: "Male", code: "M" },
  { name: "Female", code: "F" },
  { name: "Others", code: "O" },
];

const ConvertCodeToGender = (code) => {
  return Gender.filter((g) => g.code === code)[0];
};

const ConvertCodeToRole = (roles, code) => {
  return roles.filter((r) => r.code === code)[0];
};

const mapRoleToOptions = (roles) => {
  return roles.map((r) => ({
    name: r.title,
    code: r.id,
  }));
};
export const UserFormFields = {
  section: [
    {
      name: "Avatar",
      required: true,
      fields: [
        [
          {
            label: "",
            field: "avatar",
            uploadImage: true,
            Component: ({ ...props }) => {
              const { value, onChange, ...data } = props;
              return (
                <AvatarFieldHolder>
                  <AvatarHolder>
                    {value ? <Image preview src={value} /> : <p>No Avatar</p>}
                  </AvatarHolder>
                  <FileUpload
                    accept={IMAGE_CONSTANT.type}
                    auto
                    chooseLabel="Browse"
                    mode="basic"
                    name="demo[]"
                    maxFileSize={CalSizeFile(
                      `${IMAGE_CONSTANT.maxsize.size} ${IMAGE_CONSTANT.maxsize.unit}`
                    )}
                    customUpload
                    uploadHandler={async (e) => {
                      const base64Img = await getBase64(e.files[0]);
                      onChange({ target: { value: base64Img } });
                      e.options.clear();
                      props.customeUpload("_prev", value);
                      props.customeUpload("_temp", e.files[0]);
                    }}
                  />
                </AvatarFieldHolder>
              );
            },
            require: true,
          },
        ],
      ],
    },
    {
      name: "Fullname",
      required: true,
      fields: [
        [
          {
            label: "Firstname",
            field: "firstname",
            Component: ({ ...props }) => <InputText {...props} />,
            require: true,
          },
          {
            label: "Lastname",
            field: "lastname",
            Component: ({ ...props }) => <InputText {...props} />,
            require: true,
          },
        ],
      ],
    },
    {
      name: "Account",
      required: true,
      fields: [
        [
          {
            label: "Birthday",
            field: "birthday",
            Component: ({ ...props }) => (
              <Calendar
                {...props}
                value={props.value ? new Date(props.value) : new Date()}
                dateFormat="dd/mm/yy"
                showWeek
              />
            ),
            require: true,
          },
        ],
        [
          {
            label: "Role",
            field: "roles",
            Component: ({ ...props }) => {
              const { value, ...data } = props;
              return (
                <Dropdown
                  options={mapRoleToOptions(
                    props.extraDataField.roleid.options
                  )}
                  optionLabel="name"
                  value={
                    value.id
                      ? ConvertCodeToRole(
                          mapRoleToOptions(props.extraDataField.roleid.options),
                          value.id
                        )
                      : value
                  }
                  {...data}
                />
              );
            },
            require: true,
          },
          {
            label: "Gender",
            field: "gender",
            Component: ({ ...props }) => {
              const { value, ...data } = props;
              return (
                <Dropdown
                  options={Gender}
                  optionLabel="name"
                  value={
                    typeof value !== "object"
                      ? ConvertCodeToGender(value)
                      : value
                  }
                  {...data}
                />
              );
            },
            require: true,
          },
        ],
        [
          {
            label: "Username",
            field: "username",
            Component: ({ ...props }) => <InputText {...props} />,
            require: true,
          },
        ],
        [
          {
            label: "Password",
            field: "password",
            Component: ({ ...props }) => (
              <Password feedback={false} {...props} toggleMask />
            ),
            require: true,
          },
        ],
      ],
    },
  ],
};

export const AvatarFieldHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  gap: 5px;
`;

export const AvatarHolder = styled.div`
  & > span {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 100%;
    overflow: hidden;
  }
  & > span > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  & > p {
    height: fit-content;
    width: 100%;
    font-size: 0.8rem;
    text-align: left;
    margin: 10px 0;
  }
`;
