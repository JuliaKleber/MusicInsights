"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

const ToggleMode: React.FC = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  return (
    <div className="text-xl cursor-pointer text-center">
      <div
        className="text-sky-600 block dark:hidden"
      >
        <FontAwesomeIcon icon={faMoon} onClick={() => setTheme("dark")} />
      </div>
      <div
        className="text-sky-400 hidden dark:block"
      >
        <FontAwesomeIcon icon={faSun} onClick={() => setTheme("light")} />
      </div>
    </div>
  );
};

export default ToggleMode;
