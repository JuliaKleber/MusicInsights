import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useMusicDataStore from "../stores/musicDataStore";
import {
  cardStyle,
  buttonStyle,
  linkStyle,
  arrowStyle,
  inactiveArrowStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../styles/styles";
import Hide from "./Hide";
import getAlbumTracksData from "../APICalls/getAlbumTracksData";
import { parsedReleaseDate } from "../functions/sharedFunctions";

interface AlbumInfoCardProps {
  clickHandler: (spotifyId: string, category: Category, resetResults: boolean) => void;
  scrollToCard: (category: Category) => void;
}

const AlbumInfoCard = ({ clickHandler, scrollToCard }: AlbumInfoCardProps) => {
  const albumData = useMusicDataStore((state) => state.albumData);
  const setAlbumTracks = useMusicDataStore((state) => state.setAlbumTracks);
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );
  const albumSearchResults = useMusicDataStore(
    (state) => state.albumSearchResults
  );

  const indexInSearchResults = albumData
    ? albumSearchResults.indexOf(albumData.spotifyId)
    : -1;
  const nextSpotifyId = albumSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = albumSearchResults[indexInSearchResults - 1];

  const toggleTrackList = async () => {
    if (trackListShown) {
      setTrackListShown(false);
    } else {
      const albumTracks = albumData
        ? await getAlbumTracksData(albumData.spotifyId)
        : null;
      setAlbumTracks(albumTracks);
      if (albumTracks) setTrackListShown(true);
      scrollToCard("albumTracks");
    }
  };

  const artistsList = (
    <ul className="flex flex-row flex-wrap">
      {albumData?.artists.map((artist: Artist, index: number) => (
        <li
          className={`mr-1 ${linkStyle}`}
          key={index}
          onClick={() => clickHandler(artist.spotifyId, "artist", true)}
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
      src={albumData?.image}
      alt="album"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const backArrow = (
    <>
      {previousSpotifyId ? (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={arrowStyle}
          onClick={() => clickHandler(previousSpotifyId, "album", false)}
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
          onClick={() => clickHandler(nextSpotifyId, "album", false)}
        />
      ) : (
        <FontAwesomeIcon icon={faArrowRight} className={inactiveArrowStyle} />
      )}
    </>
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {albumSearchResults.length > 0 && backArrow}
      <h2>
        {artistsList} - {albumData?.name}
      </h2>
      {albumSearchResults.length > 0 && nextArrow}
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
            {parsedReleaseDate(albumData?.releaseDate)}
          </td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Label:</td>
          <td className={secondColumnStyle}>{albumData?.label}</td>
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
            {albumData?.spotifyPopularity} / 100
          </td>
        </tr>
      </tbody>
    </table>
  );

  const button = (
    <button onClick={() => toggleTrackList()} className={buttonStyle}>
      {trackListShown ? "Hide Tracks" : "Show Tracks"}
    </button>
  );

  if (!albumData) {
    return null;
  }

  return (
    <div className={cardStyle}>
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
