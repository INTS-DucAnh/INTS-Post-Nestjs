import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { styled } from "styled-components";

const mapCategoriesToOption = (categories) => {
  return categories.map((cate) => ({
    name: cate.title,
    code: cate.id,
  }));
};

const convertCategoryToOption = (options, cateogories) => {
  return cateogories.reduce((prev, curr) => {
    return [...prev, options.filter((o) => o.code === curr.id)[0]];
  }, []);
};

export const PostFormFields = {
  section: [
    {
      name: "Thumbnail",
      required: true,
      fields: [
        [
          {
            label: "",
            field: "thumbnail",
            uploadImage: true,
            Component: ({ ...props }) => {
              const { value, onChange, ...data } = props;
              return (
                <ThumbnailHolder>
                  <Thumbnail>
                    {value ? <Image preview src={value} /> : <p>No Avatar</p>}
                  </Thumbnail>
                  <FileUpload
                    accept="image/*"
                    auto
                    chooseLabel="Browse"
                    mode="basic"
                    name="demo[]"
                    maxFileSize={10000000}
                    customUpload
                    uploadHandler={(e) => {
                      props.customeUpload("thumbnail", e).then((res) => {
                        e.options.clear();
                      });
                    }}
                  />
                </ThumbnailHolder>
              );
            },
            require: true,
          },
        ],
      ],
    },
    {
      name: "Post",
      required: true,
      fields: [
        [
          {
            label: "Category",
            field: "categories",
            Component: ({ ...props }) => {
              const { value, extraDataField, disableField, ...data } = props;
              return (
                <MultiSelect
                  options={mapCategoriesToOption(
                    props.extraDataField.categories.options
                  )}
                  optionLabel="name"
                  display="chip"
                  value={
                    value.length !== 0 && value[0].id
                      ? convertCategoryToOption(
                          mapCategoriesToOption(
                            props.extraDataField.categories.options
                          ),
                          value
                        )
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
            label: "Title",
            field: "title",
            uploadImage: true,
            Component: ({ ...props }) => {
              const { value, onChange, ...data } = props;
              return <InputText {...props} />;
            },
            require: true,
          },
        ],
        [
          {
            label: "Content",
            field: "content",
            uploadImage: true,
            Component: ({ ...props }) => {
              const { value, onChange, ...data } = props;
              return (
                <InputTextarea
                  style={{ resize: "none" }}
                  autoResize
                  {...props}
                />
              );
            },
            require: true,
          },
        ],
      ],
    },
  ],
};

export const ThumbnailHolder = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
`;

export const Thumbnail = styled.div`
  width: fit-content;
  border-radius: 10px;
  overflow: hidden;
  & > p {
    height: fit-content;
    margin: 0;
  }
  & > span {
    overflow: hidden;
    height: 100%;
    aspect-ratio: 5/3;
    position: relative;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
