import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getGenre,
  getNowPlayingMv,
  getPopularMv,
  getTopRatedMv,
  IGetMovies,
} from "./../api";
import { makeImgPath } from "./utils";
import MovieSlider from "../Components/MovieSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { IGenreData } from "./../Components/BigMoive";

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

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & p {
    height: 100%;
    background-color: black; //${(props) => props.theme.black.darker};
    color: ${(props) => props.theme.white.darker};
    border-radius: 5px;
    font-size: 18px;
    white-space: nowrap;
    padding: 2px 5px;
  }
`;

const DetailBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-bottom: 20px;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;
`;

const Dates = styled.div`
  font-weight: 500;
  font-size: 18px;
`;

const Rates = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;

  path {
    fill: #ffeaa7;
  }

  & p {
    font-size: 16px;
  }
`;

const Language = styled.span`
  font-size: 18px;
  position: relative;
`;

const GenreBox = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
`;

const Genre = styled.span`
  width: 100%;
  font-size: 18px;
  white-space: nowrap;

  & + &::before {
    content: "·";
    color: gray;
    padding-right: 5px;
  }
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
  const { data: genreData } = useQuery<IGenreData>("genres", getGenre);

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
              <DetailBox>
                <Details>
                  <Category>
                    <p>개봉일</p>
                    <Dates>{popularMvData?.results[0].release_date}</Dates>
                  </Category>
                  <Category>
                    <p>언어</p>
                    <Language>
                      {popularMvData?.results[0].original_language.toUpperCase()}
                    </Language>
                  </Category>

                  <Category>
                    <p>장르</p>
                    <GenreBox>
                      {popularMvData?.results[0].genre_ids.map((id) =>
                        genreData?.genres.map(
                          (g, idx) =>
                            g.id === id && <Genre key={idx}>{g.name}</Genre>
                        )
                      )}
                    </GenreBox>
                  </Category>
                </Details>
                <Rates>
                  <>
                    {[
                      ...Array(
                        Math.trunc(
                          Math.round(popularMvData!.results[0].vote_average) / 2
                        )
                      ),
                    ].map((v, index) => (
                      <FontAwesomeIcon key={index} icon={faStar} />
                    ))}
                    {Math.trunc(
                      Math.round(popularMvData!.results[0].vote_average) % 2
                    ) ? (
                      <FontAwesomeIcon icon={faStarHalfStroke} />
                    ) : null}
                    &nbsp; <p>({`${popularMvData!.results[0].vote_count}`})</p>
                  </>
                </Rates>
              </DetailBox>
              <Overview>{popularMvData!.results[0].overview}</Overview>
            </Describe>
          </Banner>

          <MovieSlider
            movieData={{
              movieArr: [...nowPlayingMvData!.results],
              movieName: "Now Playing",
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
              movieName: "Top Rated",
            }}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
