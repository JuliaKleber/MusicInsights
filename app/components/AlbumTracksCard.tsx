import useMusicDataStore from "../stores/musicDataStore";
import { cardStyle, linkStyle } from "../styles/styles";
import Hide from "./Hide";

interface AlbumTracksCardProps {
  clickHandler: (spotifyId: string, category: Category) => void;
}

const AlbumTracksCard = ({ clickHandler }: AlbumTracksCardProps) => {
  const albumTracks = useMusicDataStore((state) => state.albumTracks);

  const image = (
    <img
      src={albumTracks?.image}
      alt="album"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const header = (
    <h2 className="text-center">
      {albumTracks &&
        albumTracks.artists.map((artist: Artist) => artist.name).join(", ")}
      <br />
      {albumTracks?.name}
    </h2>
  );

  const trackList = (
    <table className="">
      <tbody>
        {albumTracks?.tracks.map((track: Track, index: number) => (
          <tr key={track.name}>
            <td className="text-right pr-2">{index + 1}.</td>
            <td
              className={`font-bold ${linkStyle}`}
              onClick={() => clickHandler(track.spotifyId, "track")}
            >
              {track.name.split(" -")[0]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-center">{image}</div>

      <div className="m-2 flex flex-col items-center md:px-24">
        {header}
        {trackList}
      </div>
      <Hide category="trackListShown" />
    </div>
  );
};

export default AlbumTracksCard;
