import { useRecoilState } from "recoil";
import { favsMovieState, favsTVState } from "../atoms";

function FavsPage() {
  const [favsMovies, setFavsMovies] = useRecoilState(favsMovieState);
  const [favsTvs, setFavsTvs] = useRecoilState(favsTVState);

  return;
}

export default FavsPage;
