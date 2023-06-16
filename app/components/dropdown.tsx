import { ReactNode, useEffect, useRef, useState } from "react";

import Button, { ButtonAppearanceType } from "./button";

interface DropdownProps {
  id?: string;
  buttonContent: ReactNode;
  buttonAppearance?: ButtonAppearanceType;
  dropdownContent: ReactNode;
  dropdownAlign?: "right" | "left";
}

const Dropdown = ({
  id,
  buttonContent,
  buttonAppearance,
  dropdownContent,
  dropdownAlign = "left",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    // @ts-ignore
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        id={id}
        appearance={buttonAppearance}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        {buttonContent}
      </Button>

      <div
        role="menu"
        aria-hidden={!isOpen}
        aria-labelledby={id}
        className={`absolute z-10 mt-1 bg-white border rounded-lg shadow-lg ${
          dropdownAlign === "right" ? "right-0" : "left-0"
        } ${isOpen ? "" : "hidden"}`}
      >
        {dropdownContent}
      </div>
    </div>
  );
};

export default Dropdown;
