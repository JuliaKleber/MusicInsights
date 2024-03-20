import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
} from "../stores/styleStore";

const InfoText: React.FC = () => {
  const darkMode = useStyleStore((state) => state.darkMode);

  return (
    <p className="text-gray-600 text-center">
      The information shown on this page is provided by{" "}
      <a
        href="https://open.spotify.com"
        className={darkMode ? darkLinkStyle : lightLinkStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        Spotify
      </a>
      ,{" "}
      <a
        href="https://getsongbpm.com"
        className={darkMode ? darkLinkStyle : lightLinkStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        GetSongBPM.com
      </a>{" "}
      and{" "}
      <a
        href="https://musicbrainz.org"
        className={darkMode ? darkLinkStyle : lightLinkStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        MusicBrainz.org
      </a>
      .
    </p>
  );
};

export default InfoText;
