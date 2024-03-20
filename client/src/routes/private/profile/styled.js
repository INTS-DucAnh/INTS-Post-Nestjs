import { styled } from "styled-components";

export const DisplayUserInfoHolder = styled.div`
  padding: 20px;
  margin: 0 auto;
  border-radius: 15px;
  width: 500px;
  border: 1px solid var(--cyan-400);
  & > div {
    width: 100%;
    & > span {
      width: 100%;
      & > input {
        width: 100%;
      }
    }
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    justify-content: end;
  }
`;
