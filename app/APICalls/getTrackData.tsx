"use server";

import getSpotifyToken from "./getSpotifyToken";

const setSpotifyData = (data: any) => {
  const trackData: TrackData = {
    spotifyId: data.id,
    isrc: data.external_ids.isrc,
    name: data.name,
    artists: data.artists.map((artist: any) => ({
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

const setBpmAndKey = (spotifyData: any, bpmData: any) => {
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

const getKeyAndBpm = async (artist: string, song: string) => {
  const bpmKey = process.env.GET_SONG_BPM_KEY;

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

const getTrackData = async (
  id: string | null,
) => {
  const url = `https://api.spotify.com/v1/tracks/${id}`;
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
    const bpmData = await getKeyAndBpm(data.artists[0].name, data.name);
    return bpmData ? setBpmAndKey(spotifyData, bpmData) : spotifyData;
  } catch (error) {
    console.error(`Error fetching track data:`, error);
  }
};

export default getTrackData;
