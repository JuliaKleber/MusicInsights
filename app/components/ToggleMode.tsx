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
    <div className="text-xl cursor-pointer">
      <div
        className={`text-sky-600 ${
          darkMode ? "hidden" : "block"
        }`}
      >
        <FontAwesomeIcon icon={faMoon} onClick={toggleMode} />
      </div>
      <div
        className={`text-sky-400 ${
          darkMode ? "block" : "hidden"
        }`}
      >
        <FontAwesomeIcon icon={faSun} onClick={toggleMode} />
      </div>
    </div>
  );
};

export default ToggleMode;
