import { styled } from "styled-components";

export const CategoriesTemplateHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  width: 100%;
  max-width: 200px;
  flex-shrink: 0;
`;

export const CategoriesChips = styled.div`
  border-radius: 50px;
  padding: 3px 8px;
  font-size: 0.75rem;
  background-color: var(--purple-500);
  color: white;
  height: fit-content;
`;

export const ThumbnailTemplateHolder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 5px;
  & > span {
    width: 100%;
    height: 100px;
    aspect-ratio: 4/3;
    & > img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
`;
