import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DialogButtons, DialogMain } from "./styled";

export default function DialogForm({ onClose, onConfirm, children, ...props }) {
  return (
    <Dialog
      {...props}
      onHide={onClose}
      style={{ ...props.style, position: "relative", overflow: "hidden" }}
    >
      <DialogMain>{children}</DialogMain>
      <DialogButtons>
        <Button text label="Cancel" onClick={onClose} />
        <Button label="Confirm" onClick={onConfirm} />
      </DialogButtons>
    </Dialog>
  );
}
