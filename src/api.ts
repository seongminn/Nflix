const API_KEY = "1665b67f6a6b938726f4f69ea376ef50";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  video: boolean;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMv() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}

export function getPopularMv() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}

export function getTopRatedMv() {
  return fetch(`
		${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&anguage=ko-KR&page=1&region=kr
	`).then((res) => res.json());
}
