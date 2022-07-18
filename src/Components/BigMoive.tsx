import styled from "styled-components";
import { getGenre, IMovie } from "./../api";
import { motion, useViewportScroll } from "framer-motion";
import { makeImgPath } from "../Routes/utils";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const BigMovieWrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40%;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 5px;
  overflow: hidden;
  /* box-shadow: 2px 2px 18px 8px ${(props) => props.theme.black.veryDark}; */

  z-index: 999;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  position: relative;
`;

const BigTitle = styled.div`
  padding: 20px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const BigText = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 24px;
  font-weight: 600;
`;

const BigCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & p {
    height: 100%;
    background-color: ${(props) => props.theme.black.darker};
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    padding: 2px 5px;
  }
`;

const BigDetailBox = styled.div`
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const BigDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;
`;

const BigDates = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const BigRates = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;

  path {
    fill: #ffeaa7;
  }

  & p {
    font-size: 12px;
  }
`;

const BigLanguage = styled.span`
  font-size: 14px;
  position: relative;
`;

const BigGenreBox = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
`;

const BigGenre = styled.span`
  width: 100%;
  font-size: 14px;
  white-space: nowrap;

  & + &::before {
    content: "·";
    color: gray;
    padding-right: 5px;
  }
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  line-height: 1.3em;
`;

interface IMovieDetail {
  movieId?: string;
  clickedMovie: IMovie;
  movieName: string;
}

export interface IGenreData {
  genres: IGenre[];
}

interface IGenre {
  id: number;
  name: string;
}

function BigMovie({ movieId, clickedMovie, movieName }: IMovieDetail) {
  const { scrollY } = useViewportScroll();
  const { data: genreData } = useQuery<IGenreData>("genres", getGenre);

  return (
    <BigMovieWrapper
      style={{ top: scrollY.get() + 100 }}
      layoutId={movieId + movieName}
    >
      {clickedMovie && (
        <>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(to top, rgb(47, 47, 47), transparent 10%), url(${
                clickedMovie.backdrop_path
                  ? makeImgPath(clickedMovie.backdrop_path)
                  : makeImgPath(clickedMovie.poster_path)
              })`,
            }}
          ></BigCover>
          <BigTitle>
            <BigText>{clickedMovie.title}</BigText>
          </BigTitle>
          <BigDetailBox>
            <BigDetails>
              <BigCategory>
                <p>개봉일</p>
                <BigDates>{clickedMovie.release_date}</BigDates>
              </BigCategory>
              <BigCategory>
                <p>언어</p>
                <BigLanguage>
                  {clickedMovie.original_language.toUpperCase()}
                </BigLanguage>
              </BigCategory>

              <BigCategory>
                <p>장르</p>
                <BigGenreBox>
                  {clickedMovie.genre_ids.map((id) =>
                    genreData?.genres.map(
                      (g, idx) =>
                        g.id === id && <BigGenre key={idx}>{g.name}</BigGenre>
                    )
                  )}
                </BigGenreBox>
              </BigCategory>
            </BigDetails>
            <BigRates>
              <>
                {[
                  ...Array(
                    Math.trunc(Math.round(clickedMovie.vote_average) / 2)
                  ),
                ].map((v, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} />
                ))}
                {Math.trunc(Math.round(clickedMovie.vote_average) % 2) ? (
                  <FontAwesomeIcon icon={faStarHalfStroke} />
                ) : null}
                &nbsp; <p>({`${clickedMovie.vote_count}`})</p>
              </>
            </BigRates>
          </BigDetailBox>
          <BigOverview>{clickedMovie.overview}</BigOverview>
        </>
      )}
    </BigMovieWrapper>
  );
}

export default BigMovie;
