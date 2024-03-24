"use server";

import getSpotifyToken from "./getSpotifyToken";

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

const setSpotifyData = (data: any) => {
  const filteredGenres = data.genres.filter((genre: string) => {
    return genres.includes(genre);
  });
  let artistData: ArtistData = {
    spotifyId: data.id,
    name: data.name,
    genres: filteredGenres,
    spotifyPopularity: data.popularity,
    followers: data.followers.total,
    image: data.images[1].url,
  };
  return artistData;
};

const setArtistDataFromMusicBrainz = (
  spotifyData: any,
  musicBrainzData: any
) => {
  const artistData: ArtistData = {
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

const getMusicBrainzData = async (searchTerm: string) => {
  const userAgentString = process.env.MUSICBRAINZ_USER_AGENT_STRING;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://musicbrainz.org/ws/2/artist?query=${encodedSearchTerm}&limit=1`;
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
    return data.artists[0] ? data : null;
  } catch (error) {
    console.error(`Error fetching artist data from MusicBrainz:`, error);
  }
};

const getArtistData = async (id: string | null) => {
  const url = `https://api.spotify.com/v1/artists/${id}`;
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
    const spotifyData = setSpotifyData(data);
    const musicBrainzData = await getMusicBrainzData(spotifyData.name);
    return musicBrainzData
      ? setArtistDataFromMusicBrainz(spotifyData, musicBrainzData)
      : spotifyData
      ? spotifyData
      : null;
  } catch (error) {
    console.error(`Error fetching artist data:`, error);
    return null;
  }
};

export default getArtistData;
