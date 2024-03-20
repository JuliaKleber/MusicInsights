"use server";

import useMusicDataStore from "../stores/musicDataStore";
import getSpotifyToken from "./getSpotifyToken";
import { Category } from "../types/types";

const genres = [
  "acoustic",
  "afrobeat",
  "alt rock",
  "alternative",
  "ambient",
  "anime",
  "black metal",
  "bluegrass",
  "blues",
  "bossanova",
  "brazil",
  "breakbeat",
  "british",
  "cantopop",
  "chicago house",
  "children",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "dancehall",
  "death metal",
  "deep house",
  "detroit techno",
  "disco",
  "disney",
  "drum and bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "emo",
  "folk",
  "forro",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "goth",
  "grindcore",
  "groove",
  "grunge",
  "guitar",
  "happy",
  "hard rock",
  "hardcore",
  "hardstyle",
  "heavy metal",
  "hip hop",
  "holidays",
  "honky tonk",
  "house",
  "idm",
  "indian",
  "indie",
  "indie pop",
  "industrial",
  "iranian",
  "j dance",
  "j idol",
  "j pop",
  "j rock",
  "jazz",
  "k pop",
  "kids",
  "latin",
  "latino",
  "malay",
  "mandopop",
  "metal",
  "metal misc",
  "metalcore",
  "minimal techno",
  "movies",
  "mpb",
  "new age",
  "new release",
  "opera",
  "pagode",
  "party",
  "philippines opm",
  "piano",
  "pop",
  "pop film",
  "post dubstep",
  "power pop",
  "progressive house",
  "psych rock",
  "punk",
  "punk rock",
  "r n b",
  "rainy day",
  "reggae",
  "reggaeton",
  "road trip",
  "rock",
  "rock n roll",
  "rockabilly",
  "romance",
  "sad",
  "salsa",
  "samba",
  "sertanejo",
  "show tunes",
  "singer songwriter",
  "ska",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
  "swedish",
  "synth pop",
  "tango",
  "techno",
  "trance",
  "trip hop",
  "turkish",
  "work out",
  "world music",
];

const setArtistData = (data) => {
  const filteredGenres = data.genres.filter((genre: string) => {
    return genres.includes(genre);
  });
  let artistData = {
    spotifyId: data.id,
    name: data.name,
    genres: filteredGenres,
    spotifyPopularity: data.popularity,
    followers: data.followers.total,
    image: data.images[1].url,
  };
  return artistData;
};

const setArtistDataFromMusicBrainz = (spotifyData, musicBrainzData) => {
  const artistData = {
    spotifyId: spotifyData.spotifyId,
    name: spotifyData.name,
    genres: spotifyData.genres,
    spotifyPopularity: spotifyData.spotifyPopularity,
    followers: spotifyData.followers,
    image: spotifyData.image,
    formationDate: musicBrainzData.artists[0]["life-span"]?.begin || null,
    disbandmentDate: musicBrainzData.artists[0]["life-span"]?.end || null,
    isnis: musicBrainzData.artists[0].isnis ?? null,
    type: musicBrainzData.artists[0].type ?? null,
    location:
      musicBrainzData.artists[0].area?.type === "City"
        ? musicBrainzData.artists[0].area.name
        : musicBrainzData.artists[0]["begin-area"]?.name ?? null,
    country:
      musicBrainzData.artists[0].area?.type === "Country"
        ? musicBrainzData.artists[0].area.name
        : null,
  };
  return artistData;
};

const setArtistAlbums = (data) => {
  const artistAlbums = [...data.items].reverse().map((item) => ({
    spotifyId: item.id,
    name: item.name,
    releaseDate: item.release_date,
    image: item.images[2],
  }));

  return artistAlbums;
};

const setAlbumData = (data) => {
  const albumData = {
    spotifyId: data.id,
    name: data.name,
    artists: data.artists.map((artist) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
    label: data.label,
    releaseDate: data.release_date,
    spotifyPopularity: data.popularity,
    upc: data.external_ids.upc,
    image: data.images[1].url,
  };
  return albumData;
};

const setAlbumTracks = (data) => {
  useMusicDataStore.setState({
    albumTracks: {
      name: data.name,
      artists: data.artists.map((artist) => ({
        spotifyId: artist.id,
        name: artist.name,
      })),
      tracks: data.tracks.items.map((item) => ({
        spotifyId: item.id,
        name: item.name,
      })),
      image: data.images[1].url,
    },
  });
};

const setTrackData = (data) => {
  const trackData = {
    spotifyId: data.id,
    isrc: data.external_ids.isrc,
    name: data.name,
    artists: data.artists.map((artist) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
    album: {
      spotifyId: data.album.id,
      name: data.album.name,
      trackNumber: data.track_number,
    },
    spotifyPopularity: data.popularity,
    length: Math.round(data.duration_ms / 1000),
    image: data.album.images[1].url,
    releaseDate: data.album.release_date,
  };
  return trackData;
};

const setBpmAndKey = (spotifyData, bpmData) => {
  const trackData = {
    spotifyId: spotifyData.spotifyId,
    isrc: spotifyData.isrc,
    name: spotifyData.name,
    artists: spotifyData.artists,
    album: spotifyData.album,
    spotifyPopularity: spotifyData.spotifyPopularity,
    length: spotifyData.length,
    image: spotifyData.image,
    releaseDate: spotifyData.releaseDate,
    bpm: bpmData.song.tempo,
    timeSignature: bpmData.song.time_sig,
    key: bpmData.song.key_of,
  };
  return trackData;
};

const getMusicBrainzData = async (searchTerm: string, category: string) => {
  const userAgentString = process.env.MUSICBRAINZ_USER_AGENT_STRING;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://musicbrainz.org/ws/2/${category}?query=${encodedSearchTerm}&limit=1`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": userAgentString,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (category === "artist" && data.artists[0]) {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${category} data from MusicBrainz:`, error);
  }
};

const getKeyAndBpm = async (artist: string, song: string) => {
  const bpmKey = process.env.GET_SONG_BPM_KEY;
  let bpmData = null;

  const getSongId = async (artist: string, song: string) => {
    artist = artist.replaceAll(" ", "+").toLowerCase();
    song = song
      .replace(/ - [0-9]*\s?Remaster/, "")
      .replace(/\(.*\)/, "")
      .replaceAll(" ", "+")
      .toLowerCase();
    const url = `https://api.getsongbpm.com/search/?api_key=${bpmKey}&type=both&lookup=song:${song}artist:${artist}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.search[0]) {
        const songId = data.search[0].song_id;
        return getBpm(songId);
      }
    } catch (error) {
      console.error("Error fetching bpm and key data:", error);
    }
  };

  const getBpm = async (songId: string) => {
    const url = `https://api.getsongbpm.com/song/?api_key=${bpmKey}&id=${songId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bpm and key data:", error);
    }
  };
  return await getSongId(artist, song);
};

const getMetaData = async (
  id: string | null,
  category: Category,
  extra: string = ""
) => {
  const url = `https://api.spotify.com/v1/${category}s/${id}${extra}`;
  const accessToken = await getSpotifyToken();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    let returnedData = null;

    if (category === "artist" && extra === "") {
      const spotifyData = await setArtistData(data);
      const musicBrainzData = await getMusicBrainzData(
        spotifyData.name,
        "artist"
      );
      returnedData = await setArtistDataFromMusicBrainz(
        spotifyData,
        musicBrainzData
      );
    } else if (category === "artist" && extra !== "") {
      returnedData = await setArtistAlbums(data);
    } else if (category === "album") {
      returnedData = await setAlbumData(data);
      // setAlbumTracks(data);
      // useMusicDataStore.setState({ trackListShown: false });
    } else if (category === "track") {
      const spotifyData = await setTrackData(data);
      const bpmData = await getKeyAndBpm(data.artists[0].name, data.name);
      bpmData ? returnedData = await setBpmAndKey(spotifyData, bpmData) : returnedData = spotifyData;
    }
    return returnedData;
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
  }
};

export default getMetaData;
