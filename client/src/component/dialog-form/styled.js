import { styled } from "styled-components";

export const DialogMain = styled.div`
  height: fit-content;
  width: full;
  padding-bottom: 50px;
`;

export const DialogButtons = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  padding: 10px 20px 20px;
  box-sizing: border-box;
`;
