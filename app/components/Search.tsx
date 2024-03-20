import { useState } from "react";
import spotifySearch from "../APICalls/spotifySearch";
import useStyleStore, { buttonStyle } from "../stores/styleStore";
import { Category } from "../types/types";

interface SearchProps {
  scrollToCard: (category: Category, extra?: string) => void;
}

interface ButtonProps {
  text: string;
  category: Category;
}

const Search: React.FC<SearchProps> = ({
  scrollToCard
}) => {
  const darkMode = useStyleStore((state) => state.darkMode);

  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      spotifySearch(searchTerm, "artist");
      spotifySearch(searchTerm, "album");
      spotifySearch(searchTerm, "track");
    }
  };

  const handleSearch = (category: Category) => {
    spotifySearch(searchTerm, category);
    scrollToCard(category);
  };

  const input = (
    <input
      type="text"
      placeholder="Enter Search Term"
      onChange={(event) => setSearchTerm(event.target.value)}
      onKeyDown={(event) => handleKeyDown(event)}
      className={`w-64 p-1 m-1 text-center rounded-md border ${
        darkMode
          ? "text-white bg-gray-700 border-gray-900 focus:outline-none focus:border-pink-100"
          : "border-gray-200 bg-gray-50 focus:outline-none focus:border-sky-600"
      }`}
    />
  );

  const Button: React.FC<ButtonProps> = ({ text, category }) => {
    return (
      <button
        className={buttonStyle}
        onClick={() => handleSearch(category)}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {input}
      <div className="flex flex-row justify-center items-center">
        <Button text="Search Artist" category="artist" />
        <Button text="Search Album" category="album" />
        <Button text="Search Track" category="track" />
      </div>
    </div>
  );
};

export default Search;
