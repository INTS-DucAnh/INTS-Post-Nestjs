import { styled } from "styled-components";

export const NavLinkHolder = styled.div`
  width: 100%;
  border-radius: 5px;
  & > div {
    width: 100%;
    text-decoration: none;
    color: var(--grey-900);
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    cursor: pointer;
    & > i {
      width: 20px;
    }
    & > p {
      flex: 1;
      overflow: hidden;
    }
  }
`;
