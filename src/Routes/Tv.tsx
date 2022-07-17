import { useQuery } from "react-query";
import styled from "styled-components";
import { getGenre, getOnAirTv, getPopularTv, getTopRatedTv } from "../api";
import { IGetTvs } from "./../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { makeImgPath } from "./utils";
import { IGenreData } from "./../Components/MovieSlider";
import TvSlider from "./../Components/TVSlider";

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

function Tv() {
  const { data: popularTVData, isLoading: popularIsLoading } =
    useQuery<IGetTvs>(["TV", "popular"], getPopularTv);
  const { data: onAirTVData, isLoading: onAirIsLoading } = useQuery<IGetTvs>(
    ["TV", "onAir"],
    getOnAirTv
  );
  const { data: topRatedTVData, isLoading: topRatedIsLoading } =
    useQuery<IGetTvs>(["TV", "topRated"], getTopRatedTv);

  const LOADING = popularIsLoading || onAirIsLoading || topRatedIsLoading;

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
            bgphoto={makeImgPath(onAirTVData?.results[14].backdrop_path || "")}
          >
            <Describe>
              <Title>{onAirTVData?.results[14].name}</Title>
              <DetailBox>
                <Details>
                  <Category>
                    <p>개봉일</p>
                    <Dates>{onAirTVData?.results[14].first_air_date}</Dates>
                  </Category>
                  <Category>
                    <p>언어</p>
                    <Language>
                      {onAirTVData?.results[14].original_language.toUpperCase()}
                    </Language>
                  </Category>

                  <Category>
                    <p>장르</p>
                    <GenreBox>
                      {onAirTVData?.results[14].genre_ids.map((id) =>
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
                          Math.round(popularTVData!.results[14].vote_average) /
                            2
                        )
                      ),
                    ].map((v, index) => (
                      <FontAwesomeIcon key={index} icon={faStar} />
                    ))}
                    {Math.trunc(
                      Math.round(popularTVData!.results[14].vote_average) % 2
                    ) ? (
                      <FontAwesomeIcon icon={faStarHalfStroke} />
                    ) : null}
                    &nbsp; <p>({`${popularTVData!.results[14].vote_count}`})</p>
                  </>
                </Rates>
              </DetailBox>
              <Overview>{popularTVData!.results[14].overview}</Overview>
            </Describe>
          </Banner>

          <TvSlider
            tvData={{
              tvArr: [...popularTVData!.results],
              tvName: "Popular",
            }}
          />

          <TvSlider
            tvData={{
              tvArr: [...onAirTVData!.results],
              tvName: "On Air",
            }}
          />

          <TvSlider
            tvData={{
              tvArr: [...topRatedTVData!.results],
              tvName: "Top Rated",
            }}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
