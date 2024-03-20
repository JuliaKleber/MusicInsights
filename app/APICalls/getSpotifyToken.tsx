import useMusicDataStore from "../stores/musicDataStore";

const getSpotifyToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authHeader = btoa(`${clientId}:${clientSecret}`);
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    useMusicDataStore.setState({ accessToken: data.access_token });
    useMusicDataStore.setState({ tokenTimeStamp: new Date().getTime() });
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

export default getSpotifyToken;