"use server";

// import useMusicDataStore from "../stores/musicDataStore";
// if (!isTokenStillValid) accessToken = (await getSpotifyToken());
// if (!useMusicDataStore.getState().isTokenStillValid)
//   await getSpotifyToken();
// accessToken: null,
// tokenTimeStamp: new Date("2024-01-01").getTime(),
// isTokenStillValid: () => {
//   const currentTimeStamp = new Date().getTime();
//   return currentTimeStamp - useMusicDataStore.getState().tokenTimeStamp < 59 * 60 * 1000;
// },

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
    // useMusicDataStore.setState({ accessToken: data.access_token });
    // useMusicDataStore.setState({ tokenTimeStamp: new Date().getTime() });
    console.log(data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

export default getSpotifyToken;
