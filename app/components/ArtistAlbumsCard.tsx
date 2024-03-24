import useMusicDataStore from "../stores/musicDataStore";
import { cardStyle, linkStyle } from "../styles/styles";
import Hide from "./Hide";

interface ArtistAlbumsCardProps {
  clickHandler: (spotifyId: string, category: Category) => void;
}

const ArtistAlbumsCard = ({ clickHandler }: ArtistAlbumsCardProps) => {
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const artistData = useMusicDataStore((state) => state.artistData);

  const header = <h2>{artistData?.name} - Albums</h2>;

  const image = (
    <img
      src={artistData?.image}
      alt="artist"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const albumsList = (
    <ul>
      {artistAlbums?.map((album: ArtistAlbum, index: number) => {
        return (
          <li key={index}>
            {album.releaseDate?.slice(0, 4)} -{" "}
            {
              <span
                className={`font-bold ${linkStyle}`}
                onClick={() => clickHandler(album.spotifyId, "album")}
              >
                {album.name.split(" (Deluxe")[0].split(" (Remastered")[0]}
              </span>
            }
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={cardStyle}>
      <div className="md:mr-2 flex items-center justify-center">{image}</div>
      <div className="flex flex-col justify-center items-center">
        {header}
        {albumsList}
      </div>
      <Hide category="albumListShown" />
    </div>
  );
};

export default ArtistAlbumsCard;
