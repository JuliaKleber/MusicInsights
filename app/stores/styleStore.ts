import { create } from "zustand";

export const buttonStyle =
  "w-32 p-1 mt-4 mx-1 bg-sky-600 text-white rounded-md shadow-md border-none hover:bg-sky-800 hover:shadow-lg";
export const lightLinkStyle = "cursor-pointer hover:text-primaryColor";
export const darkLinkStyle = "cursor-pointer hover:text-pink-400";
export const lightHeaderStyle =
  "mx-3 text-primaryColor font-primaryFont flex flex-row flex-wrap justify-center";
export const darkHeaderStyle =
  "mx-3 text-sky-500 font-primaryFont flex flex-row flex-wrap justify-center";
export const lightArrowStyle = "text-red-300 cursor-pointer";
export const darkArrowStyle = "text-sky-300 cursor-pointer";
export const firstColumnStyle = "font-bold text-right pr-2";
export const secondColumnStyle = "pl-2";

interface StyleStoreState {
  darkMode: boolean;
  setDarkMode: (state: boolean) => void;
}

const useStyleStore = create<StyleStoreState>((set) => ({
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  setDarkMode: (state: boolean) => {
    set(() => ({ darkMode: state }));
  },
}));

export default useStyleStore;
