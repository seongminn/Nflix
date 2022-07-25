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
  original_language: string;
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

export interface IGetTvs {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  original_language: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

// Movie api

export async function getNowPlayingMv() {
  const res = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  );
  return await res.json();
}

export async function getPopularMv() {
  const res = await fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  return await res.json();
}

export async function getTopRatedMv() {
  const res = await fetch(`
		${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1
	`);
  return await res.json();
}

// TV api

export async function getOnAirTv() {
  const res = await fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  return await res.json();
}

export async function getPopularTv() {
  const res = await fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  return await res.json();
}

export async function getTopRatedTv() {
  const res = await fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  return await res.json();
}

// Genre api
export async function getGenre() {
  const res = await fetch(
    `${BASE_PATH}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`
  );
  return await res.json();
}

export async function getSearchMovie(query: string | null) {
  const res = await fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&include_adult=false`
  );

  return await res.json();
}

export async function getSearchTv(query: string | null) {
  const res = await fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&include_adult=false`
  );

  return await res.json();
}
