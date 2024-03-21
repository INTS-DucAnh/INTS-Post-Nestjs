import useRequestApi from "../../hooks/useRequestApi";
import { v4 as uuidv4 } from "uuid";
import {
  FieldsInGroupDialog,
  FormDialogHolder,
  GroupsFieldDialog,
  SectionDialog,
} from "./styled";

const RenderFields = ({ fields, data, onFieldChange, ...props }) => {
  const customUpload = async (field, file) => {
    onFieldChange(field, file);
  };

  return (
    <FieldsInGroupDialog>
      {fields.map((f) => {
        const { Component, ...field } = f;
        return (
          <span className="flex flex-column gap-2" key={field.field}>
            <label htmlFor={field.field}>{field.label}</label>
            <Component
              inputId={field.field}
              value={data[field.field] || ""}
              onChange={(e) => onFieldChange(field.field, e.target.value)}
              disabled={props.disableField.includes(field.field)}
              customeUpload={field.uploadImage ? customUpload : null}
              {...props}
            />
          </span>
        );
      })}
    </FieldsInGroupDialog>
  );
};

const RenderGroups = ({ groups, data, onFieldChange, ...props }) => {
  return (
    <GroupsFieldDialog>
      {groups.map((gr) => (
        <RenderFields
          fields={gr}
          data={data}
          onFieldChange={onFieldChange}
          {...props}
        />
      ))}
    </GroupsFieldDialog>
  );
};

const FormSection = ({
  isRequired = false,
  heading,
  fields,
  data,
  onFieldChange,
  ...props
}) => {
  return (
    <SectionDialog>
      <div>
        <p>
          {heading}
          <b className="required-tag">{isRequired && " *"}</b>
        </p>
      </div>
      <div>
        <RenderGroups
          groups={fields}
          data={data}
          onFieldChange={onFieldChange}
          {...props}
        />
      </div>
    </SectionDialog>
  );
};

export default function FormHolder({
  formFields,
  disableField,
  data,
  change,
  extraDataField,
}) {
  return (
    <FormDialogHolder>
      {formFields.section.map((section) => (
        <div key={section.name}>
          <FormSection
            key={section.name}
            isRequired={section.required}
            heading={section.name}
            fields={section.fields}
            data={data}
            onFieldChange={change}
            disableField={disableField}
            extraDataField={extraDataField}
          />
        </div>
      ))}
    </FormDialogHolder>
  );
}
