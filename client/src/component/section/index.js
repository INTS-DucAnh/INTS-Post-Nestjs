import { Button } from "primereact/button";
import { SectionHeader, SectionHolder } from "./styled";

export default function SectionContent({
  title,
  children,
  onSelectCreate = null,
  onRefresh = null,
  ...props
}) {
  return (
    <SectionHolder>
      <SectionHeader>
        <p>{title}</p>
        <div className="flex flex-row gap-2">
          {onSelectCreate && (
            <Button
              onClick={() => onSelectCreate && onSelectCreate()}
              icon="pi pi-plus"
              label="Add record"
            />
          )}
          <Button icon="pi pi-refresh" outlined onClick={onRefresh} />
        </div>
      </SectionHeader>
      <div>{children}</div>
    </SectionHolder>
  );
}
