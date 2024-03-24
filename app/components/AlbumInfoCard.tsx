import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useMusicDataStore from "../stores/musicDataStore";
import {
  cardStyle,
  buttonStyle,
  linkStyle,
  arrowStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../styles/styles";
import Hide from "./Hide";
import getArtistData from "../APICalls/getArtistData";
import getAlbumData from "../APICalls/getAlbumData";
import getAlbumTracksData from "../APICalls/getAlbumTracksData";
import { parsedReleaseDate } from "../functions/sharedFunctions";

interface AlbumInfoCardProps {
  scrollToCard: (category: Category) => void;
}

const AlbumInfoCard: React.FC<AlbumInfoCardProps> = ({ scrollToCard }) => {
  const albumData = useMusicDataStore((state) => state.albumData);
  const setArtistData = useMusicDataStore((state) => state.setArtistData);
  const setArtistAlbums = useMusicDataStore((state) => state.setArtistAlbums);
  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const setAlbumTracks = useMusicDataStore((state) => state.setAlbumTracks);
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );
  const albumSearchResults = useMusicDataStore(
    (state) => state.albumSearchResults
  );
  const resetArtistSearchResults = useMusicDataStore(
    (state) => state.resetArtistSearchResults
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

  const onClick = async (spotifyId: string, category: Category) => {
    if (category === "artist") {
      const data = await getArtistData(spotifyId);
      setArtistData(data);
      resetArtistSearchResults();
      setArtistAlbums([]);
      setAlbumListShown(false);
    } else if (category === "album") {
      const data = await getAlbumData(spotifyId);
      setAlbumData(data);
      setTrackListShown(false);
    }
    scrollToCard(category);
  };

  const artistsList = (
    <ul className="flex flex-row flex-wrap">
      {albumData?.artists.map((artist: Artist, index: number) => (
        <li
          className={`mr-1 ${linkStyle}`}
          key={index}
          onClick={() => onClick(artist.spotifyId, "artist")}
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

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {previousSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={arrowStyle}
          onClick={() => onClick(previousSpotifyId, "album")}
        />
      )}
      <h2>
        {artistsList} - {albumData?.name}
      </h2>
      {nextSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={arrowStyle}
          onClick={() => onClick(nextSpotifyId, "album")}
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
