import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useMusicDataStore from "../stores/musicDataStore";
import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
  darkArrowStyle,
  lightArrowStyle,
  darkHeaderStyle,
  lightHeaderStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../stores/styleStore";
import Hide from "./Hide";
import getSpotifyData from "../APICalls/getMetaData";
import { parsedReleaseDate } from "../functions/sharedFunctions";
import { Category, Artist } from "../types/types";

interface AlbumInfoCardProps {
  onArtistClick: (id: string, category: Category) => void;
  albumTracksRef: React.RefObject<HTMLDivElement>;
}

const AlbumInfoCard: React.FC<AlbumInfoCardProps> = ({
  onArtistClick,
  albumTracksRef,
}) => {
  const albumData = useMusicDataStore((state) => state.albumData);
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );
  const albumSearchResults = useMusicDataStore(
    (state) => state.albumSearchResults
  );

  const darkMode = useStyleStore((state) => state.darkMode);

  const indexInSearchResults = albumSearchResults.indexOf(albumData.spotifyId);
  const nextSpotifyId = albumSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = albumSearchResults[indexInSearchResults - 1];

  const toggleTrackList = () => {
    if (trackListShown) {
      setTrackListShown(false);
    } else {
      setTrackListShown(true);
      albumTracksRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const artistsList = (
    <ul className="flex flex-row flex-wrap">
      {albumData.artists.map((artist: Artist, index: number) => (
        <li
          className={`mr-1 ${darkMode ? darkLinkStyle : lightLinkStyle}`}
          key={index}
          onClick={() => onArtistClick(artist.spotifyId, "artist")}
        >
          {index + 1 < albumData.artists.length
            ? `${artist.name}, `
            : artist.name}
        </li>
      ))}
    </ul>
  );

  const image = (
    <img
      src={albumData.image}
      alt="album"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {previousSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => getSpotifyData(previousSpotifyId, "album")}
        />
      )}
      <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
        {artistsList} - {albumData.name}
      </h2>
      {nextSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => getSpotifyData(nextSpotifyId, "album")}
        />
      )}
    </div>
  );

  const table = (
    <table className="rounded-md shadow-custom">
      <tbody>
        <tr>
          <td className={firstColumnStyle}>Artist(s):</td>
          <td className={secondColumnStyle}>{artistsList}</td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Release Date:</td>
          <td className={secondColumnStyle}>
            {parsedReleaseDate(albumData.releaseDate)}
          </td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Label:</td>
          <td className={secondColumnStyle}>{albumData.label}</td>
        </tr>
        {/* <tr>
          <td className={firstColumnStyle}>Producer:</td>
          <td className='pl-2'></td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Recording Studio:</td>
          <td className='pl-2'></td>
        </tr> */}
        <tr>
          <td className={firstColumnStyle}>Popularity on Spotify:</td>
          <td className={secondColumnStyle}>
            {albumData.spotifyPopularity} / 100
          </td>
        </tr>
      </tbody>
    </table>
  );

  const button = (
    <button onClick={() => toggleTrackList()} className={`w-32 ${buttonStyle}`}>
      {trackListShown ? "Hide Tracks" : "Show Tracks"}
    </button>
  );

  if (!albumData) {
    return null;
  }

  return (
    <div
      className={`m-5 p-2 flex flex-col md:flex-row justify-between rounded-lg shadow-costum ${
        darkMode && "bg-darkBackground"
      }`}
    >
      <div className="flex items-center justify-center">{image}</div>

      <div className="p-3 flex flex-col items-center justify-center">
        {header}
        {table}
        {button}
      </div>

      <Hide category="albumData" />
    </div>
  );
};

export default AlbumInfoCard;
