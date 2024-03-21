import useMusicDataStore from "../stores/musicDataStore";
import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
  darkHeaderStyle,
  lightHeaderStyle,
} from "../stores/styleStore";
import Hide from "./Hide";
import getMetaData from "../APICalls/getMetaData";
import { Category, ArtistAlbum, AlbumData } from "../types/types";

interface ArtistAlbumsCardProps {
  scrollToCard: (category: Category) => void;
}

const ArtistAlbumsCard: React.FC<ArtistAlbumsCardProps> = ({
  scrollToCard,
}) => {
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const artistData = useMusicDataStore((state) => state.artistData);
  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const resetAlbumSearchResults = useMusicDataStore(
    (state) => state.resetAlbumSearchResults
  );

  const darkMode = useStyleStore((state) => state.darkMode);

  const header = (
    <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
      {artistData?.name} - Albums
    </h2>
  );

  const image = (
    <img
      src={artistData.image}
      alt="artist"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const onAlbumClick = async (id: string, category: Category) => {
    if (category === "album") {
      const data: AlbumData = await getMetaData(id, "album");
      setAlbumData(data);
      resetAlbumSearchResults();
    }
    scrollToCard(category);
  }

  const albumsList = (
    <ul>
      {artistAlbums?.map((album: ArtistAlbum, index: number) => {
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
