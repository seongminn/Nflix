import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMv,
  getPopularMv,
  getTopRatedMv,
  IGetMovies,
} from "./../api";
import { makeImgPath } from "./utils";
import MovieSlider from "../Components/MovieSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background-color: black;
`;

const LoadWrapper = styled.div`
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div``;

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
  font-weight: bold;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  font-weight: 400;
`;

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
        <LoadWrapper>
          <Loader>
            Loading &nbsp;
            <FontAwesomeIcon icon={faSpinner}></FontAwesomeIcon>
          </Loader>
        </LoadWrapper>
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

          <MovieSlider
            movieData={{
              movieArr: [...nowPlayingMvData!.results],
              movieName: "Now_Playing",
            }}
          />
          <MovieSlider
            movieData={{
              movieArr: [...popularMvData!.results],
              movieName: "Popular",
            }}
          />
          <MovieSlider
            movieData={{
              movieArr: topRatedMvData!.results,
              movieName: "Top_Rated",
            }}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
