"use server";

import getSpotifyToken from "./getSpotifyToken";

const setArtistAlbums = (data: any) => {
  const artistAlbums: ArtistAlbum[] = [...data.items].reverse().map((item) => ({
    spotifyId: item.id,
    name: item.name,
    releaseDate: item.release_date,
    image: item.images[2],
  }));
  return artistAlbums;
};

const getArtistAlbumsData = async (
  id: string | null,
  extra: string = ""
) => {
  const url = `https://api.spotify.com/v1/artists/${id}${extra}`;
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
    return setArtistAlbums(data);
  } catch (error) {
    console.error(`Error fetching artist's albums data:`, error);
  }
};

export default getArtistAlbumsData;
