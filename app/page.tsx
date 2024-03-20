"use client";

import { useEffect, useRef } from "react";
import useMusicDataStore from "./stores/musicDataStore";
import useStyleStore, {
  lightLinkStyle,
  darkLinkStyle,
  darkArrowStyle,
  lightArrowStyle,
  darkHeaderStyle,
  lightHeaderStyle,
  firstColumnStyle,
  secondColumnStyle,
} from "./stores/styleStore";
import getSpotifyToken from "./APICalls/getSpotifyToken";
import getRecommendations from "./APICalls/getRecommendations";
import getSpotifyData from "./APICalls/getMetaData";
import ToggleMode from "./components/ToggleMode";
import Search from "./components/Search";
import ArtistInfoCard from "./components/ArtistInfoCard";
import ArtistAlbumsCard from "./components/ArtistAlbumsCard";
import AlbumInfoCard from "./components/AlbumInfoCard";
import TrackInfoCard from "./components/TrackInfoCard";
import AlbumTracksCard from "./components/AlbumTracksCard";
import RecommendationsCard from "./components/RecommendationsCard";
import InfoText from "./components/InfoText";
import { Category } from "./types/types";

export default function Home() {
  const isTokenStillValid = useMusicDataStore(
    (state) => state.isTokenStillValid
  );
  const accessToken = useMusicDataStore((state) => state.accessToken);
  const recommendations = useMusicDataStore((state) => state.recommendations);
  const artistData = useMusicDataStore((state) => state.artistData);
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const albumListShown = useMusicDataStore((state) => state.albumListShown);
  const albumData = useMusicDataStore((state) => state.albumData);
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const trackData = useMusicDataStore((state) => state.trackData);
  const resetArtistSearchResults = useMusicDataStore(
    (state) => state.resetArtistSearchResults
  );
  const resetAlbumSearchResults = useMusicDataStore(
    (state) => state.resetAlbumSearchResults
  );
  const resetTrackSearchResults = useMusicDataStore(
    (state) => state.resetTrackSearchResults
  );

  const darkMode = useStyleStore((state) => state.darkMode);

  const recommendationsCardRef = useRef(null);
  const artistInfoCardRef = useRef(null);
  const artistAlbumsCardRef = useRef(null);
  const albumInfoCardRef = useRef(null);
  const albumTracksCardRef = useRef(null);
  const trackInfoCardRef = useRef(null);

  useEffect(() => {
    getSpotifyToken();
    darkMode
      ? (document.body.style.backgroundColor = "rgb(17 24 39)")
      : (document.body.style.backgroundColor = "white");
  }, [darkMode]);

  const retrieveSpotifyData = async (
    id: string,
    category: Category,
    extra?: string
  ) => {
    getSpotifyData(id, category, extra);
    if (category === "artist" && extra === undefined) {
      artistInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      resetArtistSearchResults();
    }
    if (category === "album") {
      albumInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      resetAlbumSearchResults();
    }
    if (category === "track") {
      trackInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      resetTrackSearchResults();
    }
  };

  const handleGiveRecommendations = async (genre: string) => {
    if (!isTokenStillValid) await getSpotifyToken();
    getRecommendations(genre, accessToken);
    if (recommendationsCardRef.current) {
      recommendationsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div
      className={`p-3 flex flex-col items-center ${
        darkMode && "text-pink-100"
      }`}
    >
      <ToggleMode />
      <div className="m-3">
        <Search
          artistInfoCardRef={artistInfoCardRef}
          albumInfoCardRef={albumInfoCardRef}
          trackInfoCardRef={trackInfoCardRef}
        />
      </div>

      <div ref={recommendationsCardRef}>
        {recommendations && (
          <RecommendationsCard
            onGetArtist={retrieveSpotifyData}
            onGetTrack={retrieveSpotifyData}
          />
        )}
      </div>

      <div>
        <div ref={artistInfoCardRef}>
          {artistData && (
            <ArtistInfoCard
              onToggleAlbumList={retrieveSpotifyData}
              onGiveRecommendations={handleGiveRecommendations}
              artistAlbumsRef={artistAlbumsCardRef}
            />
          )}
        </div>
        <div ref={artistAlbumsCardRef}>
          {albumListShown && artistAlbums && (
            <ArtistAlbumsCard onAlbumClick={retrieveSpotifyData} />
          )}
        </div>
        <div ref={albumInfoCardRef}>
          {albumData && (
            <AlbumInfoCard
              onArtistClick={retrieveSpotifyData}
              albumTracksRef={albumTracksCardRef}
            />
          )}
        </div>
        <div ref={albumTracksCardRef}>
          {trackListShown && (
            <AlbumTracksCard onTrackClick={retrieveSpotifyData} />
          )}
        </div>
        <div ref={trackInfoCardRef}>
          {trackData && (
            <TrackInfoCard
              onArtistClick={retrieveSpotifyData}
              onAlbumClick={retrieveSpotifyData}
            />
          )}
        </div>
      </div>
      <InfoText />
    </div>
  );
}
