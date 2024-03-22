import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import getMetaData from "../APICalls/getMetaData";
import { parsedReleaseDate } from "../functions/sharedFunctions";
import useMusicDataStore from "../stores/musicDataStore";
import {
  cardStyle,
  linkStyle,
  arrowStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../styles/styles";

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
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );
  const setTrackData = useMusicDataStore((state) => state.setTrackData);
  const resetArtistSearchResults = useMusicDataStore(
    (state) => state.resetArtistSearchResults
  );
  const resetAlbumSearchResults = useMusicDataStore(
    (state) => state.resetAlbumSearchResults
  );

  const indexInSearchResults = trackData
    ? trackSearchResults.indexOf(trackData.spotifyId)
    : -1;
  const nextSpotifyId = trackSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = trackSearchResults[indexInSearchResults - 1];

  const onClick = async (spotifyId: string, category: Category) => {
    const data = await getMetaData(spotifyId, category);
    if (category === "artist") {
      setArtistData(data);
      resetArtistSearchResults();
      setArtistAlbums([]);
    }
    if (category === "album") {
      setAlbumData(data);
      resetAlbumSearchResults();
      setTrackListShown(false);
    }
    if (category === "track") setTrackData(data);
    scrollToCard(category);
  };

  const image = (
    <img
      src={trackData?.image}
      alt="track"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const artistsList = (
    <ul className="flex flex-col sm:flex-row flex-wrap">
      {trackData?.artists.map((artist: Artist, index: number) => (
        <li
          className={`mr-1 ${linkStyle}`}
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
          className={arrowStyle}
          onClick={() => onClick(previousSpotifyId, "track")}
        />
      )}
      <h2>
        {trackData?.artists[0].name}{" "}
        {trackData && trackData.artists.length > 1 && " & v.a."} -{" "}
        {trackData?.name}
      </h2>
      {nextSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={arrowStyle}
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
            className={`${secondColumnStyle} ${linkStyle}`}
            onClick={() =>
              onClick(trackData ? trackData.album.spotifyId : "", "album")
            }
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
    <div className={cardStyle}>
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
