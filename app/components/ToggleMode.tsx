import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import useStyleStore from "../stores/styleStore";

const ToggleMode: React.FC = () => {
  const darkMode = useStyleStore((state) => state.darkMode);
  const setDarkMode = useStyleStore((state) => state.setDarkMode);

  const toggleMode = () => {
    darkMode ? setDarkMode(false) : setDarkMode(true);
  };

  return (
    <div className="p-5 py-0 text-xl flex flex-row justify-between 2xl:justify-center">
      <div
        className={`text-sky-600 cursor-pointer ${
          darkMode ? "hidden" : "block"
        }`}
      >
        <FontAwesomeIcon icon={faMoon} onClick={toggleMode} />
      </div>
      <div
        className={`text-sky-400 cursor-pointer ${
          darkMode ? "block" : "hidden"
        }`}
      >
        <FontAwesomeIcon icon={faSun} onClick={toggleMode} />
      </div>
    </div>
  );
};

export default ToggleMode;
