import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import useStyleStore from "../stores/styleStore";

const ToggleMode: React.FC = () => {
  const darkMode = useStyleStore((state) => state.darkMode);
  const setDarkMode = useStyleStore((state) => state.setDarkMode);
  const [moonVisible, setMoonVisible] = useState(darkMode);

  const toggleMode = () => {
    darkMode ? setDarkMode(false) : setDarkMode(true);
    darkMode ? setMoonVisible(false) : setMoonVisible(true);
  };

  return (
    <div className="p-5 py-0 text-xl flex flex-row justify-between 2xl:justify-center">
      <FontAwesomeIcon
        icon={faMoon}
        className={`text-sky-600 cursor-pointer ${
          moonVisible ? "hidden" : "block"
        }`}
        onClick={toggleMode}
      />
      <FontAwesomeIcon
        icon={faSun}
        className={`text-sky-400 cursor-pointer ${
          moonVisible ? "block" : "hidden"
        }`}
        onClick={toggleMode}
      />
    </div>
  );
};

export default ToggleMode;
