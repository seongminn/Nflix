const API_KEY = "1665b67f6a6b938726f4f69ea376ef50";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  video: boolean;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
}

export interface IGetMovies {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export async function getNowPlayingMv() {
  const res = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  );
  return await res.json();
}

export async function getPopularMv() {
  const res = await fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  );
  return await res.json();
}

export async function getTopRatedMv() {
  const res = await fetch(`
		${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=kr
	`);
  return await res.json();
}

export async function getGenre() {
  const res = await fetch(
    `${BASE_PATH}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`
  );
  return await res.json();
}
