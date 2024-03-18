import { styled } from "styled-components";

export const SectionHolder = styled.section`
  height: fit-content;
  width: 100%;
  display: block;
  border-radius: 5px;
  box-sizing: border-box;
`;

export const SectionHeader = styled.section`
  height: fit-content;
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > button {
    font-size: 0.9rem;
  }
`;
