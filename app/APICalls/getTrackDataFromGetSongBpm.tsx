"use server";

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

const getTrackDataFromGetSongBpm = async (spotifyData: TrackData) => {
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
  const bpmData = await getSongId(spotifyData.artists[0].name, spotifyData.name);
  return bpmData ? setBpmAndKey(spotifyData, bpmData) : spotifyData;
};

export default getTrackDataFromGetSongBpm;
