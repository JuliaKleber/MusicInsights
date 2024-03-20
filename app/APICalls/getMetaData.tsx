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
  useMusicDataStore.setState({
    artistData: {
      spotifyId: data.id,
      name: data.name,
      genres: filteredGenres,
      spotifyPopularity: data.popularity,
      followers: data.followers.total,
      image: data.images[1].url,
    },
  });
};

const setArtistDataFromMusicBrainz = (data) => {
  const previousArtistData = useMusicDataStore.getState().artistData;
  useMusicDataStore.setState({
    artistData: {
      spotifyId: previousArtistData.spotifyId,
      name: previousArtistData.name,
      genres: previousArtistData.genres,
      spotifyPopularity: previousArtistData.spotifyPopularity,
      followers: previousArtistData.followers,
      image: previousArtistData.image,
      formationDate: data.artists[0]["life-span"]?.begin || null,
      disbandmentDate: data.artists[0]["life-span"]?.end || null,
      isnis: data.artists[0].isnis ?? null,
      type: data.artists[0].type ?? null,
      location:
        data.artists[0].area?.type === "City"
          ? data.artists[0].area.name
          : data.artists[0]["begin-area"]?.name ?? null,
      country:
        data.artists[0].area?.type === "Country"
          ? data.artists[0].area.name
          : null,
    },
  });
};

const setArtistAlbums = (data) => {
  const previousArtistData = useMusicDataStore.getState().artistData;
  useMusicDataStore.setState({
    artistAlbums: {
      name: previousArtistData.name,
      image: previousArtistData.image,
      albums: [...data.items].reverse().map((item) => ({
        spotifyId: item.id,
        name: item.name,
        releaseDate: item.release_date,
        image: item.images[2],
      })),
    },
  });
};

const setAlbumData = (data) => {
  useMusicDataStore.setState({
    albumData: {
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
    },
  });
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
  useMusicDataStore.setState({
    trackData: {
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
    },
  });
};

const setBpmAndKey = (data) => {
  const previousTrackData = useMusicDataStore.getState().trackData;
  useMusicDataStore.setState({
    trackData: {
      spotifyId: previousTrackData.spotifyId,
      isrc: previousTrackData.isrc,
      name: previousTrackData.name,
      artists: previousTrackData.artists,
      album: previousTrackData.album,
      spotifyPopularity: previousTrackData.spotifyPopularity,
      length: previousTrackData.length,
      image: previousTrackData.image,
      releaseDate: previousTrackData.releaseDate,
      bpm: data.song.tempo,
      timeSignature: data.song.time_sig,
      key: data.song.key_of,
    },
  });
};

const getMusicBrainzData = async (searchTerm: string, category: string) => {
  const userAgentString = process.env.NEXT_PUBLIC_MUSICBRAINZ_USER_AGENT_STRING;
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
      setArtistDataFromMusicBrainz(data);
    }
  } catch (error) {
    console.error(`Error fetching ${category} data from MusicBrainz:`, error);
  }
};

const getKeyAndBpm = async (artist: string, song: string) => {
  const bpmKey = process.env.NEXT_PUBLIC_GET_SONG_BPM_KEY;

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
        getBpm(songId);
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
      setBpmAndKey(data);
    } catch (error) {
      console.error("Error fetching bpm and key data:", error);
    }
  };
  getSongId(artist, song);
};

const getSpotifyData = async (
  id: string | null,
  category: Category,
  extra: string = ""
) => {
  const url = `https://api.spotify.com/v1/${category}s/${id}${extra}`;
  try {
    if (!useMusicDataStore.getState().isTokenStillValid)
      await getSpotifyToken();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${useMusicDataStore.getState().accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (category === "artist" && extra === "") {
      setArtistData(data);
      useMusicDataStore.setState({ albumListShown: false });
      getMusicBrainzData(data.name, "artist");
    } else if (category === "artist" && extra !== "") {
      setArtistAlbums(data);
      useMusicDataStore.setState({ albumListShown: true });
    } else if (category === "album") {
      setAlbumData(data);
      setAlbumTracks(data);
      useMusicDataStore.setState({ trackListShown: false });
    } else if (category === "track") {
      setTrackData(data);
      getKeyAndBpm(data.artists[0].name, data.name);
    }
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
  }
};

export default getSpotifyData;
