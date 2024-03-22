import { linkStyle } from "../styles/styles";

const InfoText: React.FC = () => {
  return (
    <p className="text-gray-600 text-center">
      The information shown on this page is provided by{" "}
      <a
        href="https://open.spotify.com"
        className={linkStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        Spotify
      </a>
      ,{" "}
      <a
        href="https://getsongbpm.com"
        className={linkStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        GetSongBPM.com
      </a>{" "}
      and{" "}
      <a
        href="https://musicbrainz.org"
        className={linkStyle}
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
