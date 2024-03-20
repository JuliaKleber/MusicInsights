import useMusicDataStore from "../stores/musicDataStore";
import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
  darkHeaderStyle,
  lightHeaderStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../stores/styleStore";
import Hide from "./Hide";
import { Category, Track } from "../types/types";

interface RecommendationsCardProps {
  onGetArtist: (
    id: string,
    category: Category,
    extra?: string
  ) => Promise<void>;
  onGetTrack: (id: string, category: Category, extra?: string) => Promise<void>;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  onGetArtist,
  onGetTrack,
}) => {
  const recommendations = useMusicDataStore((state) => state.recommendations);
  const genre = useMusicDataStore((state) => state.genre);
  const darkMode = useStyleStore((state) => state.darkMode);

  const header = (
    <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
      Recommendations for {genre}
    </h2>
  );

  const table = typeof recommendations !== "string" && (
    <table>
      <tbody>
        {recommendations.map((track: Track, trackIndex: number) => {
          return (
            <tr key={trackIndex}>
              <td className={firstColumnStyle}>
                <span
                  className={darkMode ? darkLinkStyle : lightLinkStyle}
                  onClick={() =>
                    onGetArtist(track.artists[0].spotifyId, "artist")
                  }
                >
                  {track.artists[0].name}
                </span>
                {track.artists.length > 1 ? " & v.a.:" : ":"}
              </td>
              <td
                className={`${secondColumnStyle} ${
                  darkMode ? darkLinkStyle : lightLinkStyle
                }`}
                onClick={() => onGetTrack(track.spotifyId, "track")}
              >
                {track.name}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div
      className={`m-4 p-2 flex justify-center rounded-lg shadow-costum ${
        darkMode && "bg-darkBackground"
      }`}
    >
      <div className="flex flex-col ">
        {header}
        {typeof recommendations !== "string" ? table : recommendations}
      </div>
      <Hide category="recommendations" />
    </div>
  );
};

export default RecommendationsCard;
