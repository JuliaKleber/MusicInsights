"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Hide from "./Hide";
import getMetaData from "../APICalls/getMetaData";
import getRecommendations from "../APICalls/getRecommendations";
import useMusicDataStore from "../stores/musicDataStore";
import useStyleStore, {
  buttonStyle,
  lightLinkStyle,
  darkLinkStyle,
  darkArrowStyle,
  lightArrowStyle,
  darkHeaderStyle,
  lightHeaderStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "../stores/styleStore";
import { Category } from "../types/types";

interface ArtistInfoCardProps {
  scrollToCard: (category: Category, endpoint?: string) => void;
}

const ArtistInfoCard: React.FC<ArtistInfoCardProps> = ({ scrollToCard }) => {
  const artistData = useMusicDataStore((state) => state.artistData);
  const albumListShown = useMusicDataStore((state) => state.albumListShown);
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );
  const setGenre = useMusicDataStore((state) => state.setGenre);
  const artistSearchResults = useMusicDataStore(
    (state) => state.artistSearchResults
  );

  const darkMode = useStyleStore((state) => state.darkMode);

  const indexInSearchResults = artistSearchResults.indexOf(
    artistData.spotifyId
  );
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
      await getMetaData(
        artistData.spotifyId,
        "artist",
        "/albums?include_groups=album&limit=50"
      );
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

  const genreClick = (genre: string) => {
    setGenre(genre);
    getRecommendations(genre.toLowerCase().replaceAll(" ", "-"));
    scrollToCard("recommendations");
  };

  const image = (
    <img
      src={artistData.image}
      alt="artist"
      className="w-64 mt-4 md:mt-0 rounded-md md:rounded-l-lg md:rounded-r-none"
    />
  );

  const header = (
    <div className="flex flex-row mb-3 items-center">
      {previousSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => getMetaData(previousSpotifyId, "artist")}
        />
      )}
      <h2 className={darkMode ? darkHeaderStyle : lightHeaderStyle}>
        {artistData.name}
      </h2>
      {nextSpotifyId && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={darkMode ? darkArrowStyle : lightArrowStyle}
          onClick={() => getMetaData(nextSpotifyId, "artist")}
        />
      )}
    </div>
  );

  const table = (
    <table className="table-auto">
      <tbody>
        {artistData.genres.length !== 0 && (
          <tr>
            <td className={firstColumnStyle}>Genre(s):</td>
            <td className={secondColumnStyle}>
              <ul className="flex flex-row flex-wrap">
                {parsedGenres(artistData.genres).map((genre, index) => {
                  return (
                    <li
                      className={`mr-1 ${
                        darkMode ? darkLinkStyle : lightLinkStyle
                      }`}
                      onClick={() => genreClick(genre)}
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
        {artistData.formationDate && (
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
        {(artistData.location || artistData.country) && (
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
            {artistData.spotifyPopularity} / 100
          </td>
        </tr>
        <tr>
          <td className={firstColumnStyle}>Followers on Spotify:</td>
          <td className={secondColumnStyle}>
            {parsedFollowers(artistData.followers)}
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
    <div
      className={`m-5 p-2 flex flex-col md:flex-row justify-between rounded-lg shadow-costum ${
        darkMode && "bg-darkBackground"
      }`}
    >
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
