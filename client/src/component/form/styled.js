import { styled } from "styled-components";

export const FormDialogHolder = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionDialog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border-radius: 10px;
  transition-duration: 0.15s;
  padding: 10px;
  &:hover {
    background-color: var(--blue-50);
  }
  & > div:first-child {
    border-bottom: 1px solid rgb(0, 0, 0, 0.1);
    padding: 0 0 10px 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

export const GroupsFieldDialog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FieldsInGroupDialog = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  & > span {
    flex: 1;
    & > label {
      font-size: 0.85rem;
    }
    & > input {
      width: 100%;
    }
    & > div > input {
      width: 100%;
    }
  }
  .p-multiselect-label {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .p-multiselect-token {
    margin: 0;
  }
`;
