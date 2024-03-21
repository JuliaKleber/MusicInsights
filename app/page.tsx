"use client";

import { useRef } from "react";
import ToggleMode from "./components/ToggleMode";
import Search from "./components/Search";
import ArtistInfoCard from "./components/ArtistInfoCard";
import ArtistAlbumsCard from "./components/ArtistAlbumsCard";
import AlbumInfoCard from "./components/AlbumInfoCard";
import TrackInfoCard from "./components/TrackInfoCard";
import AlbumTracksCard from "./components/AlbumTracksCard";
import RecommendationsCard from "./components/RecommendationsCard";
import InfoText from "./components/InfoText";
import useMusicDataStore from "./stores/musicDataStore";
import useStyleStore from "./stores/styleStore";
import { Category } from "./types/types";

export default function Home() {
  const recommendations = useMusicDataStore((state) => state.recommendations);
  const artistData = useMusicDataStore((state) => state.artistData);
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const albumListShown = useMusicDataStore((state) => state.albumListShown);
  const albumData = useMusicDataStore((state) => state.albumData);
  const albumTracks = useMusicDataStore((state) => state.albumTracks);
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const trackData = useMusicDataStore((state) => state.trackData);

  const darkMode = useStyleStore((state) => state.darkMode);

  const recommendationsCardRef = useRef(null);
  const artistInfoCardRef = useRef(null);
  const artistAlbumsCardRef = useRef(null);
  const albumInfoCardRef = useRef(null);
  const albumTracksCardRef = useRef(null);
  const trackInfoCardRef = useRef(null);

  const scrollToCard = async (category: Category, extra?: string) => {
    if (category === "artist" && extra === undefined) {
      artistInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "artist" && extra !== undefined) {
      artistAlbumsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "album") {
      albumInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "albumTracks") {
      albumTracksCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "track") {
      trackInfoCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "recommendations") {
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
        <Search scrollToCard={scrollToCard} />
      </div>

      <div ref={recommendationsCardRef}>
        {recommendations.length > 0 && (
          <RecommendationsCard scrollToCard={scrollToCard} />
        )}
      </div>

      <div>
        <div ref={artistInfoCardRef}>
          {artistData && <ArtistInfoCard scrollToCard={scrollToCard} />}
        </div>
        <div ref={artistAlbumsCardRef}>
          {albumListShown && artistAlbums.length > 0 && artistData && (
            <ArtistAlbumsCard scrollToCard={scrollToCard} />
          )}
        </div>
        <div ref={albumInfoCardRef}>
          {albumData && (
            <AlbumInfoCard
              scrollToCard={scrollToCard}
              albumTracksRef={albumTracksCardRef}
            />
          )}
        </div>
        <div ref={albumTracksCardRef}>
          {trackListShown && albumTracks && (
            <AlbumTracksCard scrollToCard={scrollToCard} />
          )}
        </div>
        <div ref={trackInfoCardRef}>
          {trackData && <TrackInfoCard scrollToCard={scrollToCard} />}
        </div>
      </div>
      <InfoText />
    </div>
  );
}
