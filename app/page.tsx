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
import getArtistData from "./APICalls/getArtistData";
import getAlbumData from "./APICalls/getAlbumData";
import getTrackDataFromSpotify from "./APICalls/getTrackDataFromSpotify";
import getTrackDataFromGetSongBpm from "./APICalls/getTrackDataFromGetSongBpm";
import useMusicDataStore from "./stores/musicDataStore";

export default function Home() {
  const recommendations = useMusicDataStore((state) => state.recommendations);
  const artistData = useMusicDataStore((state) => state.artistData);
  const artistAlbums = useMusicDataStore((state) => state.artistAlbums);
  const albumListShown = useMusicDataStore((state) => state.albumListShown);
  const albumData = useMusicDataStore((state) => state.albumData);
  const albumTracks = useMusicDataStore((state) => state.albumTracks);
  const trackListShown = useMusicDataStore((state) => state.trackListShown);
  const trackData = useMusicDataStore((state) => state.trackData);

  const setArtistData = useMusicDataStore((state) => state.setArtistData);
  const setArtistAlbums = useMusicDataStore((state) => state.setArtistAlbums);

  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );

  const setTrackData = useMusicDataStore((state) => state.setTrackData);
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );

  const resetArtistSearchResults = useMusicDataStore(
    (state) => state.resetArtistSearchResults
  );
  const resetAlbumSearchResults = useMusicDataStore(
    (state) => state.resetAlbumSearchResults
  );
  const resetTrackSearchResults = useMusicDataStore(
    (state) => state.resetTrackSearchResults
  );

  const recommendationsCardRef = useRef<null | HTMLDivElement>(null);
  const artistInfoCardRef = useRef<null | HTMLDivElement>(null);
  const artistAlbumsCardRef = useRef<null | HTMLDivElement>(null);
  const albumInfoCardRef = useRef<null | HTMLDivElement>(null);
  const albumTracksCardRef = useRef<null | HTMLDivElement>(null);
  const trackInfoCardRef = useRef<null | HTMLDivElement>(null);

  const clickHandler = async (spotifyId: string, category: Category, resetSearch: boolean = true) => {
    if (category === "artist") {
      const data = await getArtistData(spotifyId);
      setArtistData(data);
      setArtistAlbums([]);
      setAlbumListShown(false);
      if (resetSearch === true) resetArtistSearchResults();
    } else if (category === "album") {
      const data = await getAlbumData(spotifyId);
      setAlbumData(data);
      setTrackListShown(false);
      if (resetSearch === true) resetAlbumSearchResults();
    } else if (category === "track") {
      const spotifyData = await getTrackDataFromSpotify(spotifyId);
      setTrackData(spotifyData);
      if (resetSearch === true) resetTrackSearchResults();
      const bpmData =  spotifyData && await getTrackDataFromGetSongBpm(spotifyData);
      setTrackData(bpmData);
    }
    scrollToCard(category);
  };

  const scrollToCard = (category: Category, extra: string = "") => {
    if (category === "artist" && extra === "") {
      artistInfoCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "artist" && extra !== "") {
      artistAlbumsCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "album") {
      albumInfoCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "albumTracks") {
      albumTracksCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "track") {
      trackInfoCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (category === "recommendations") {
      recommendationsCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className={`p-3 flex flex-col items-center`}>
      <ToggleMode />
      <div className="m-3">
        <Search scrollToCard={scrollToCard} />
      </div>

      <div ref={recommendationsCardRef}>
        {recommendations.length > 0 && (
          <RecommendationsCard
            clickHandler={clickHandler}
            scrollToCard={scrollToCard}
          />
        )}
      </div>

      <div>
        <div ref={artistInfoCardRef}>
          {artistData && (
            <ArtistInfoCard
              clickHandler={clickHandler}
              scrollToCard={scrollToCard}
            />
          )}
        </div>
        <div ref={artistAlbumsCardRef}>
          {albumListShown && artistAlbums && artistData && (
            <ArtistAlbumsCard clickHandler={clickHandler} />
          )}
        </div>
        <div ref={albumInfoCardRef}>
          {albumData && (
            <AlbumInfoCard
              clickHandler={clickHandler}
              scrollToCard={scrollToCard}
            />
          )}
        </div>
        <div ref={albumTracksCardRef}>
          {trackListShown && albumTracks && (
            <AlbumTracksCard clickHandler={clickHandler} />
          )}
        </div>
        <div ref={trackInfoCardRef}>
          {trackData && <TrackInfoCard clickHandler={clickHandler} />}
        </div>
      </div>

      <InfoText />
    </div>
  );
}
