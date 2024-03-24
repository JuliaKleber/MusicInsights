import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import getRecommendations from "../APICalls/getRecommendations";
import useMusicDataStore from "../stores/musicDataStore";
import {
  linkStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../styles/styles";

interface RecommendationsCardProps {
  clickHandler: (spotifyId: string, category: Category) => void;
  scrollToCard: (category: Category, extra?: string) => void;
}

const RecommendationsCard = ({
  clickHandler,
  scrollToCard,
}: RecommendationsCardProps) => {
  const genre = useMusicDataStore((state) => state.genre);
  const recommendations = useMusicDataStore((state) => state.recommendations);
  const setRecommendations = useMusicDataStore(
    (state) => state.setRecommendations
  );

  const showNewTracks = async () => {
    const recommendations = genre
      ? await getRecommendations(genre.toLowerCase().replaceAll(" ", "-"))
      : null;
    setRecommendations(recommendations);
    scrollToCard("recommendations");
  };

  const header = (
    <div className="mb-3 flex flex-row justify-center items-center">
      <h2>Recommendations for {genre}</h2>
      <FontAwesomeIcon
        icon={faShuffle}
        className="
          dark:text-sky-300 text-red-300 cursor-pointer"
        onClick={() => showNewTracks()}
        role="button"
        aria-label="Give new recommendations"
      />
    </div>
  );

  const table = (
    <table>
      <tbody>
        {recommendations.map(
          (recommendation: Recommendation, trackIndex: number) => {
            return (
              <tr key={trackIndex}>
                <td className={firstColumnStyle}>
                  <span
                    className={linkStyle}
                    onClick={() =>
                      clickHandler(
                        recommendation.artists[0].spotifyId,
                        "artist"
                      )
                    }
                  >
                    {recommendation.artists[0].name}
                  </span>
                  {recommendation.artists.length > 1 ? " & v.a.:" : ":"}
                </td>
                <td
                  className={`${secondColumnStyle} ${linkStyle}`}
                  onClick={() =>
                    clickHandler(recommendation.spotifyId, "track")
                  }
                >
                  {recommendation.name}
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );

  return (
    <div
      className={
        "m-5 mb-0 p-2 flex justify-center rounded-lg shadow-costum dark:bg-bgDark"
      }
    >
      <div className="flex flex-col ">
        {header}
        {table}
      </div>
      <Hide category="recommendations" />
    </div>
  );
};

export default RecommendationsCard;
