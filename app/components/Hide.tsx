import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useMusicDataStore from "../stores/musicDataStore";
import { DataCategory } from "../types/types";

interface HideProps {
  category: DataCategory;
}

const Hide: React.FC<HideProps> = ({ category }) => {
  const setArtistData = useMusicDataStore((state) => state.setArtistData);
  const setArtistSearchResults = useMusicDataStore(
    (state) => state.setArtistSearchResults
  );
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );
  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );
  const setTrackData = useMusicDataStore((state) => state.setTrackData);
  const setRecommendations = useMusicDataStore(
    (state) => state.setRecommendations
  );

  const setCategoryInStore: () => void = () => {
    switch (category) {
      case "artistData":
        setArtistData(null);
        setArtistSearchResults([]);
        break;
      case "albumListShown":
        setAlbumListShown(null);
        break;
      case "albumData":
        setAlbumData(null);
        break;
      case "trackListShown":
        setTrackListShown(null);
        break;
      case "trackData":
        setTrackData(null);
        break;
      case "recommendations":
        setRecommendations(null);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-end items-end">
      <FontAwesomeIcon
        icon={faEyeSlash}
        className="text-gray-500 cursor-pointer"
        onClick={() => setCategoryInStore()}
        role="button"
        aria-label="Hide Card"
      />
    </div>
  );
};

export default Hide;
