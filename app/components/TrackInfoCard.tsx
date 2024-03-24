import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import { parsedReleaseDate } from "../functions/sharedFunctions";
import useMusicDataStore from "../stores/musicDataStore";
import {
  cardStyle,
  linkStyle,
  arrowStyle,
  inactiveArrowStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../styles/styles";

interface TrackInfoCardProps {
  clickHandler: (
    spotifyId: string,
    category: Category,
    resetResults: boolean
  ) => void;
}

const TrackInfoCard = ({ clickHandler }: TrackInfoCardProps) => {
  const trackSearchResults = useMusicDataStore(
    (state) => state.trackSearchResults
  );
  const trackData = useMusicDataStore((state) => state.trackData);

  const indexInSearchResults = trackData
    ? trackSearchResults.indexOf(trackData.spotifyId)
    : -1;
  const nextSpotifyId = trackSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = trackSearchResults[indexInSearchResults - 1];

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
          onClick={() => clickHandler(artist.spotifyId, "artist", true)}
        >
          {index !== trackData.artists.length - 1
            ? `${artist.name}, `
            : artist.name}
        </li>
      ))}
    </ul>
  );

  const backArrow = (
    <>
      {previousSpotifyId ? (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={arrowStyle}
          onClick={() => clickHandler(previousSpotifyId, "track", false)}
        />
      ) : (
        <FontAwesomeIcon icon={faArrowLeft} className={inactiveArrowStyle} />
      )}
    </>
  );

  const nextArrow = (
    <>
      {nextSpotifyId ? (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={arrowStyle}
          onClick={() => clickHandler(nextSpotifyId, "track", false)}
        />
      ) : (
        <FontAwesomeIcon icon={faArrowRight} className={inactiveArrowStyle} />
      )}
    </>
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {trackSearchResults.length > 0 && backArrow}
      <h2>
        {trackData?.artists[0].name}{" "}
        {trackData && trackData.artists.length > 1 && " & v.a."} -{" "}
        {trackData?.name}
      </h2>
      {trackSearchResults.length > 0 && nextArrow}
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
              clickHandler(
                trackData ? trackData.album.spotifyId : "",
                "album",
                true
              )
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
