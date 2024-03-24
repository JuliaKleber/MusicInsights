"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import getArtistAlbumsData from "../APICalls/getArtistAlbumsData";
import getRecommendations from "../APICalls/getRecommendations";
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

interface ArtistInfoCardProps {
  clickHandler: (
    spotifyId: string,
    category: Category,
    resetResults: boolean
  ) => void;
  scrollToCard: (category: Category, endpoint?: string) => void;
}

const ArtistInfoCard = ({
  clickHandler,
  scrollToCard,
}: ArtistInfoCardProps) => {
  const artistData = useMusicDataStore((state) => state.artistData);
  const setArtistAlbums = useMusicDataStore((state) => state.setArtistAlbums);
  const albumListShown = useMusicDataStore((state) => state.albumListShown);
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );
  const setGenre = useMusicDataStore((state) => state.setGenre);
  const setRecommendations = useMusicDataStore(
    (state) => state.setRecommendations
  );
  const artistSearchResults = useMusicDataStore(
    (state) => state.artistSearchResults
  );

  const indexInSearchResults =
    artistData && artistSearchResults
      ? artistSearchResults.indexOf(artistData.spotifyId)
      : -1;
  const nextSpotifyId = artistSearchResults[indexInSearchResults + 1];
  const previousSpotifyId = artistSearchResults[indexInSearchResults - 1];

  const parsedGenres = (genres: string[]) => {
    return genres.map((genre) =>
      genre
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const toggleAlbumList = async () => {
    if (albumListShown) {
      setAlbumListShown(false);
    } else {
      setAlbumListShown(true);
      const artistAlbums = artistData
        ? await getArtistAlbumsData(
            artistData.spotifyId,
            "/albums?include_groups=album&limit=50"
          )
        : [];
      setArtistAlbums(artistAlbums);
      scrollToCard("artist", "/albums?include_groups=album&limit=50");
    }
  };

  const parsedFollowers = (artistFollowers: number) => {
    let followers = "";
    if (artistFollowers > 999999) {
      followers += Math.floor(artistFollowers / 1000000).toString() + ".";
    }
    if (artistFollowers > 999) {
      followers +=
        Math.floor(artistFollowers / 1000)
          .toString()
          .slice(-3) + ".";
    }
    followers += artistFollowers.toString().slice(-3);
    return followers;
  };

  const onGenreClick = async (genre: string) => {
    setGenre(genre);
    const recommendations = await getRecommendations(
      genre.toLowerCase().replaceAll(" ", "-")
    );
    setRecommendations(recommendations);
    scrollToCard("recommendations");
  };

  const image = (
    <img
      src={artistData?.image}
      alt="artist"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const backArrow = (
    <>
      {previousSpotifyId ? (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={arrowStyle}
          onClick={() => clickHandler(previousSpotifyId, "artist", false)}
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
          onClick={() => clickHandler(nextSpotifyId, "artist", false)}
        />
      ) : (
        <FontAwesomeIcon icon={faArrowRight} className={inactiveArrowStyle} />
      )}
    </>
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {artistSearchResults.length > 0 && backArrow}
      <h2>{artistData?.name}</h2>
      {artistSearchResults.length > 0 && nextArrow}
    </div>
  );

  const table = (
    <table className="table-auto">
      <tbody>
        {artistData?.genres?.length !== 0 && (
          <tr>
            <td className={firstColumnStyle}>Genre(s):</td>
            <td className={secondColumnStyle}>
              <ul className="flex flex-row flex-wrap">
                {artistData &&
                  parsedGenres(artistData.genres).map((genre, index) => {
                    return (
                      <li
                        className={`mr-1 ${linkStyle}`}
                        onClick={() => onGenreClick(genre)}
                        key={index}
                      >
                        {index === artistData.genres.length - 1
                          ? genre
                          : `${genre},`}
                      </li>
                    );
                  })}
              </ul>
            </td>
          </tr>
        )}
        {artistData?.formationDate && (
          <tr>
            <td className={firstColumnStyle}>Active:</td>
            <td className={secondColumnStyle}>
              {artistData.disbandmentDate !== null &&
              artistData.disbandmentDate !== undefined
                ? `${artistData.formationDate.slice(
                    0,
                    4
                  )} - ${artistData.disbandmentDate.slice(0, 4)}`
                : `since ${artistData.formationDate.slice(0, 4)}`}
            </td>
          </tr>
        )}
        {(artistData?.location || artistData?.country) && (
          <tr>
            <td className={firstColumnStyle}>Location:</td>
            <td className={secondColumnStyle}>
              {artistData.location}
              {artistData.location && artistData.country && ", "}
              {artistData.country}
            </td>
          </tr>
        )}
        <tr>
          <td className={firstColumnStyle}>Popularity on Spotify:</td>
          <td className={secondColumnStyle}>
            {artistData?.spotifyPopularity} / 100
          </td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Followers on Spotify:</td>
          <td className={secondColumnStyle}>
            {artistData && parsedFollowers(artistData.followers)}
          </td>
        </tr>
      </tbody>
    </table>
  );

  const button = (
    <button onClick={() => toggleAlbumList()} className={buttonStyle}>
      {albumListShown ? "Hide Albums" : "Show Albums"}
    </button>
  );

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-center">{image}</div>

      <div className="p-3 flex flex-col justify-center items-center">
        {header}
        {table}
        {button}
      </div>

      <Hide category="artistData" />
    </div>
  );
};

export default ArtistInfoCard;
