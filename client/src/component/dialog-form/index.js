import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function DialogForm({ onClose, onConfirm, children, ...props }) {
  return (
    <Dialog onHide={onClose} {...props}>
      <div>{children}</div>
      <div>
        <Button text label="Cancel" onClick={onClose} />
        <Button label="Confirm" onClick={onConfirm} />
      </div>
    </Dialog>
  );
}
