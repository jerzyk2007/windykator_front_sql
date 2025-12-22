import { createPortal } from "react-dom";

const TooltipPortal = ({ visible, x, y, content, position }) => {
  if (!visible) return null;

  return createPortal(
    <div
      className={`portal-tooltip ${position}`}
      style={{
        top: y,
        left: x,
      }}
    >
      {content}
    </div>,
    document.body
  );
};

export default TooltipPortal;
