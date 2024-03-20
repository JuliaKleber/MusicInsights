"use server";

let tokenTimeStamp = new Date("2024-01-01").getTime();
let isTokenStillValid = new Date().getTime() - tokenTimeStamp < 59 * 60 * 1000;
let accessToken: string | null = null;

const getSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authHeader = btoa(`${clientId}:${clientSecret}`);
  if (isTokenStillValid) return accessToken;
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
    accessToken = data.access_token;
    tokenTimeStamp = new Date().getTime();
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

export default getSpotifyToken;
