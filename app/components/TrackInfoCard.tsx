import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import getMetaData from "../APICalls/getMetaData";
import { parsedReleaseDate } from "../functions/sharedFunctions";
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
import { Category, Artist } from "../types/types";

interface TrackInfoCardProps {
  scrollToCard: (category: Category) => void;
}

const TrackInfoCard: React.FC<TrackInfoCardProps> = ({ scrollToCard }) => {
  const trackSearchResults = useMusicDataStore(
    (state) => state.trackSearchResults
  );
  const trackData = useMusicDataStore((state) => state.trackData);
  const setArtistData = useMusicDataStore((state) => state.setArtistData);
  const setArtistAlbums = useMusicDataStore((state) => state.setArtistAlbums);
  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const setTrackData = useMusicDataStore((state) => state.setTrackData);
  const resetArtistSearchResults = useMusicDataStore(
    (state) => state.resetArtistSearchResults
  );
  const resetAlbumSearchResults = useMusicDataStore(
    (state) => state.resetAlbumSearchResults
  );

  const darkMode = useStyleStore((state) => state.darkMode);

  const indexInSearchResults = trackSearchResults.indexOf(trackData.spotifyId);
  const nextSpotifyId = trackSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = trackSearchResults[indexInSearchResults - 1];

  const onClick = async (spotifyId: string, category: Category) => {
    const data = await getMetaData(spotifyId, category);
    if (category === "artist") setArtistData(data);
    if (category === "artist") resetArtistSearchResults();
    if (category === "artist") setArtistAlbums([]);
    if (category === "album") setAlbumData(data);
    if (category === "album") resetAlbumSearchResults();
    if (category === "track") setTrackData(data);
    scrollToCard(category);
  };

  const image = (
    <img
      src={trackData.image}
      alt="track"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const artistsList = (
    <ul className="flex flex-col sm:flex-row flex-wrap">
      {trackData?.artists.map((artist: Artist, index: number) => (
        <li
          className={`mr-1 ${darkMode ? darkLinkStyle : lightLinkStyle}`}
          key={index}
          onClick={() => onClick(artist.spotifyId, "artist")}
        >
          {index !== trackData.artists.length - 1
            ? `${artist.name}, `
            : artist.name}
        </li>
      ))}
    </ul>
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {previousSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => onClick(previousSpotifyId, "track")}
        />
      )}
      <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
        {trackData?.artists[0].name} {trackData.artists.length > 1 && " & v.a."}{" "}
        - {trackData?.name}
      </h2>
      {nextSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => onClick(nextSpotifyId, "track")}
        />
      )}
    </div>
  );

  const table = (
    <table>
      <tbody>
        <tr>
          <td className={firstColumnStyle}>Artist(s):</td>
          <td className={secondColumnStyle}>{artistsList}</td>
        </tr>
        {/* <tr>
          <td className={firstColumnStyle}>Author(s):</td>
          <td className={secondColumnStyle}></td>
        </tr> */}
        <tr>
          <td className={firstColumnStyle}>Album:</td>
          <td
            className={`${secondColumnStyle} ${
              darkMode ? darkLinkStyle : lightLinkStyle
            }`}
            onClick={() => onClick(trackData?.album.spotifyId, "album")}
          >
            {
              trackData?.album.name
                .split(" (Remastered")[0]
                .split(" (Deluxe")[0]
            }
          </td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Release Date:</td>
          <td className={secondColumnStyle}>
            {parsedReleaseDate(trackData?.releaseDate)}
          </td>
        </tr>
        {trackData?.bpm && (
          <>
            <tr>
              <td className={firstColumnStyle}>Key:</td>
              <td className={secondColumnStyle}>{trackData.key}</td>
            </tr>
            <tr>
              <td className={firstColumnStyle}>Time Signature:</td>
              <td className={secondColumnStyle}>{trackData.timeSignature}</td>
            </tr>
            <tr>
              <td className={firstColumnStyle}>Tempo:</td>
              <td className={secondColumnStyle}>
                {trackData.bpm} {trackData.bpm && "bpm"}
              </td>
            </tr>
          </>
        )}
        <tr>
          <td className={firstColumnStyle}>Length:</td>
          <td className={secondColumnStyle}>{trackData?.length} s</td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Popularity on Spotify:</td>
          <td className={secondColumnStyle}>
            {trackData?.spotifyPopularity} / 100
          </td>
        </tr>
      </tbody>
    </table>
  );

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
      </div>
      <Hide category="trackData" />
    </div>
  );
};

export default TrackInfoCard;
