import { styled } from "styled-components";

export const TemplateUser = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TemplateUserImage = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  overflow: hidden;
  background: var(--cyan-100);
  justify-content: center;
  align-items: center;
  display: flex;
  & > p {
    width: fit-content;
    height: fit-content;
    font-size: 0.7rem;
  }
  & > img {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
`;

export const TempalteUserDetail = styled.div`
  flex: 1;
`;

export const TemplateGender = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 50px;
  & > p {
    font-size: 0.9rem;
    color: black;
  }

  &.o {
    background-color: var(--orange-500);
    & > p {
      color: white;
    }
  }
  &.f {
    background-color: var(--pink-500);
  }
  &.m {
    background-color: var(--teal-200);
  }
`;

export const TemplateRole = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 50px;
  & > p {
    font-size: 0.85rem;
    color: black;
  }

  &.editor {
    background-color: var(--purple-200);
  }
  &.admin {
    background-color: var(--teal-500);
  }
`;
