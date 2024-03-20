import { styled } from "styled-components";

export const LoginFormHolder = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  background-color: var(--cyan-100);
`;

export const LoginForm = styled.form`
  height: fit-content;
  width: fit-content;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 0 20px rgb(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
`;

export const ImageForm = styled.div`
  overflow: hidden;
  height: 500px;
  width: 400px;
  & > span {
    height: 100%;
    width: 100%;
    position: relative;
  }
  & > span > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const LoginMainForm = styled.div`
  width: 400px;
  height: fit-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;
  gap: 20px;
  & > h1 {
    width: 100%;
    text-align: center;
    margin: 30px 0;
  }
  & > div {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    & > label {
      font-size: 0.9rem;
    }
    & > div > input {
      width: 100%;
    }
  }
  & > button {
    margin-top: 20px;
  }
`;
