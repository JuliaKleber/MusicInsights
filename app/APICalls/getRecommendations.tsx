import getSpotifyToken from "./getSpotifyToken";
import useMusicDataStore from "../stores/musicDataStore";

const setRecommendations = (data) => {
  const tracks = data.tracks.map((track) => ({
    name: track.name,
    spotifyId: track.id,
    artists: track.artists.map((artist) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
  }));
  useMusicDataStore.setState({ recommendations: tracks });
};

const getRecommendations: (genre: string) => Promise<void> = async (genre) => {
  const accessToken = await getSpotifyToken();
  const url = `https://api.spotify.com/v1/recommendations?limit=5&seed_genres=${genre}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.tracks.length !== 0) {
      setRecommendations(data);
    } else {
      useMusicDataStore.setState({
        recommendations: [],
      });
    }
  } catch (error) {
    useMusicDataStore.setState({ recommendations: [] });
    console.error("Error fetching search data:", error);
  }
};

export default getRecommendations;
