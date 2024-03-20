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

const getRecommendations: (
  genre: string,
  accessToken: string
) => Promise<void> = async (genre, accessToken) => {
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
        recommendations: `No recommendations found`,
      });
    }
  } catch (error) {
    useMusicDataStore.setState({ recommendations: `No recommendations found` });
    console.error("Error fetching search data:", error);
  }
};

export default getRecommendations;
