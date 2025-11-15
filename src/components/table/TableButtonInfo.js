import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@mui/material";
import "./TableButtonInfo.css";

const TableButtonInfo = ({
  disabled,
  onClick,
  tooltipText,
  children,
  className,
}) => {
  const [tooltipPos, setTooltipPos] = useState(null);

  const showTooltip = (e) => {
    if (disabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + 40,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const hideTooltip = () => {
    setTooltipPos(null);
  };

  return (
    <>
      <section
        className="table_button_info"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        <Button
          className={className}
          disabled={disabled}
          onClick={!disabled ? onClick : undefined}
        >
          {children}
        </Button>
      </section>

      {/* Tooltip Portal */}
      {disabled &&
        tooltipPos &&
        createPortal(
          <div
            className="table_button_info-floating"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateX(-50%)",
            }}
          >
            {tooltipText}
          </div>,
          document.body
        )}
    </>
  );
};

export default TableButtonInfo;
