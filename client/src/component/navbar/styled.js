import { styled } from "styled-components";

export const NavBarHolder = styled.div`
  height: 100%;
  width: 290px;
  background: var(--surface-0);
  box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
`;

export const NavBarHeading = styled.div`
  width: 100%;
  margin: 5px 0;
  & > div {
    font-weight: bold;
    height: fit-content;
    padding: 10px 10px;
    & > div {
      height: fit-content;
      gap: 5px;
      & > i {
        transform: scale(1.3);
        color: var(--cyan-300);
      }
      & > p {
        font-size: 1.2rem;
        letter-spacing: 1px;
        text-align: left;
      }
    }
  }
`;

export const NavBarMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  gap: 2px;

  & > div {
    transition-duration: 0.2s;
    padding: 2px 0;
    & > div {
      box-sizing: border-box;
      padding: 10px 10px;
      & > i {
        transform: scale(0.9);
      }
      & > p {
        font-size: 0.85rem;
      }
    }
    &:hover {
      background: var(--cyan-100);
    }
  }
  & > div.selected {
    background: var(--cyan-300);
    & > div > * {
      color: white;
    }
    &:hover {
      background: var(--cyan-100);
    }
  }
`;
