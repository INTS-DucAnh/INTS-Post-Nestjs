import { styled } from "styled-components";

export const CategoriesTemplateHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  width: 150px;
  flex-shrink: 0;
`;

export const CategoriesChips = styled.div`
  border-radius: 50px;
  padding: 3px 8px;
  font-size: 0.7rem;
  background-color: var(--cyan-500);
  color: white;
  height: fit-content;
`;

export const ThumbnailTemplateHolder = styled.div`
  position: relative;
  display: block;
  aspect-ratio: 4/3;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;
