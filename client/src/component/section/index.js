import { SectionHeader, SectionHolder } from "./styled";

export default function SectionContent({ title, children, ...props }) {
  return (
    <SectionHolder>
      <SectionHeader>
        <p>{title}</p>
      </SectionHeader>
      <div>{children}</div>
    </SectionHolder>
  );
}
