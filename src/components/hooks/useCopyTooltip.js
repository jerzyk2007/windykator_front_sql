import { useState } from "react";

// funkcja do osbługi wpisów do LoaAndChat, podswiętla i kopiuje mail, itd
const useCopyTooltip = () => {
  const [clickedIndex, setClickedIndex] = useState(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
    position: "top",
  });

  const handleCopyClick = (value, index) => {
    if (!value) return;

    navigator.clipboard.writeText(value);
    setClickedIndex(index);

    setTimeout(() => setClickedIndex(null), 300);
  };

  const handleMouseEnter = (e, value) => {
    if (!value) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const spaceAbove = rect.top;
    const showBelow = spaceAbove < 150;

    setTooltip({
      visible: true,
      x: rect.left,
      y: showBelow ? rect.bottom : rect.top,
      content: value,
      position: showBelow ? "bottom" : "top",
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return {
    tooltip,
    clickedIndex,
    handleCopyClick,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useCopyTooltip;
