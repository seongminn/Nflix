import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMv,
  getPopularMv,
  getTopRatedMv,
  IGetMovies,
} from "./../api";
import { makeImgPath } from "./utils";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Describe = styled.div`
  position: absolute;
  bottom: 250px;
  width: 50%;
`;

const Title = styled.h2`
  font-size: 3vw;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 1vw;
`;

const offset = 6;

function Home() {
  const { isLoading: isPopularMvLoading, data: popularMvData } =
    useQuery<IGetMovies>(["movies", "popularMv"], getPopularMv);
  const { isLoading: isNowPlayingMvLoading, data: nowPlayingMvData } =
    useQuery<IGetMovies>(["movies", "nowPlaying"], getNowPlayingMv);
  const { isLoading: isTopRatedMvLoading, data: topRatedMvData } =
    useQuery<IGetMovies>(["movies", "topRated"], getTopRatedMv);

  const LOADING =
    isPopularMvLoading || isNowPlayingMvLoading || isTopRatedMvLoading;

  return (
    <Wrapper>
      {LOADING ? (
        <Loader>Loading..</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImgPath(popularMvData?.results[0].backdrop_path || "")}
          >
            <Describe>
              <Title>{popularMvData?.results[0].title}</Title>
              <Overview>{popularMvData?.results[0].overview}</Overview>
            </Describe>
          </Banner>

          <MovieSlider movieData={popularMvData!.results} name={"Popular"} />
          <MovieSlider
            movieData={nowPlayingMvData!.results}
            name={"Now Playing"}
          />
          <MovieSlider movieData={topRatedMvData!.results} name={"Top Rated"} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
