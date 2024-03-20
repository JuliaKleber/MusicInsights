import useMusicDataStore from "../stores/musicDataStore";
import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
  darkHeaderStyle,
  lightHeaderStyle,
} from "../stores/styleStore";
import Hide from "./Hide";
import { Category, Album } from "../types/types";

interface ArtistAlbumsCardProps {
  onAlbumClick: (spotifyId: string, category: Category) => void;
}

const ArtistAlbumsCard: React.FC<ArtistAlbumsCardProps> = ({
  onAlbumClick,
}) => {
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const darkMode = useStyleStore((state) => state.darkMode);

  const header = (
    <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
      {artistAlbums.name} - Albums
    </h2>
  );

  const image = (
    <img
      src={artistAlbums.image}
      alt="artist"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const albumsList = (
    <ul>
      {artistAlbums.albums.map((album: Album, index: number) => {
        return (
          <li key={index}>
            {album.releaseDate?.slice(0, 4)} -{" "}
            {
              <span
                className={`font-bold ${
                  darkMode ? darkLinkStyle : lightLinkStyle
                }`}
                onClick={() => onAlbumClick(album.spotifyId, "album")}
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
    <div
      className={`m-4 p-2 flex flex-col md:flex-row justify-between rounded-lg shadow-costum ${
        darkMode && "bg-darkBackground"
      }`}
    >
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
