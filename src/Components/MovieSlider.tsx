import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { makeImgPath } from "../Routes/utils";
import { IMovie } from "./../api";
import {
  faCaretLeft,
  faCaretRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useSetRecoilState } from "recoil";
import { favsMovieState, overlayState } from "./../atoms";
import BigMovie from "./BigMoive";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const Slider = styled.div`
  position: relative;
  top: -150px;
  margin-bottom: 100px;
  height: 250px;
`;

const Category = styled.p`
  padding: 0 60px;
  margin-bottom: 20px;
  font-size: 1.4vw;
  font-weight: 600;
  font-family: "Source Sans Pro";

  &::before {
    content: "";
    height: 10px;
    width: 2px;
    background-color: ${(props) => props.theme.red};
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  gap: 5px;
  width: 100%;
  padding: 0 60px;
`;

const Box = styled(motion.div)`
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:hover h4 {
    color: white;
  }
`;

const BoxImg = styled.div<{ bgphoto: string }>`
  position: relative;
  height: 200px;
  border-radius: 5px;

  background-image: url(${(props) => props.bgphoto});
  background-color: white;
  background-size: cover;
`;

const BoxOverlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, 10%, black);
  opacity: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Stars = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 10px;

  path {
    fill: #ffeaa7;
  }
`;

const Hearts = styled(motion.div)`
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const Info = styled(motion.div)`
  padding: 10px 0 10px 10px;
  background-color: transparent;
  opacity: 1;
  width: 100%;

  h4 {
    color: #ffffffde;
    text-align: right;
    font-size: 16px;
    line-height: 1.47;
    font-weight: 700;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.1s;
  }
`;

const LeftBtn = styled.button`
  position: absolute;
  top: 84px;
  left: 20px;
  font-size: 32px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border-color: transparent;

  cursor: pointer;
`;

const RightBtn = styled.button`
  position: absolute;
  top: 84px;
  right: 20px;
  font-size: 32px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border-color: transparent;

  cursor: pointer;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  opacity: 0;

  z-index: 99;
`;

const rowVars = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 10 : window.outerWidth + 10,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 10 : -window.outerWidth - 10,
  }),
};

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    transition: { delay: 0, duration: 0.3, type: "tween" },
    y: -10,
  },
};

const hoverVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0, duration: 0.3, type: "tween" },
  },
};

const offset = 6;

export interface IMovieData {
  movieData: {
    movieArr: IMovie[];
    movieName: string;
  };
}

function MovieSlider({ movieData }: IMovieData) {
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [favs, setFavs] = useRecoilState(favsMovieState);
  const setOverlay = useSetRecoilState(overlayState);
  const navigate = useNavigate();

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = (dir: string) => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.movieArr.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (dir === "prev") {
        setBack(true);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (dir === "next") {
        setBack(false);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const onBoxClicked = (movieId: number) => {
    setOverlay(true);
    navigate(`/movies/${movieData.movieName}/${movieId}`);
  };

  const bigMovieMatch = useMatch(`movies/:movieCategory/:movieId`);

  const { movieCategory } = useParams();

  const onOverlayClick = () => {
    setOverlay(false);
    navigate(`/`);
  };

  const onClickHeart = (e: React.MouseEvent<HTMLDivElement>, movie: IMovie) => {
    e.stopPropagation();
    setFavs((favs: IMovie[]) => {
      const prevFavs = [...favs];

      const favIndex = prevFavs.findIndex((fav) => fav.id === movie.id);

      let resultFavs;
      if (favIndex === -1) {
        resultFavs = [...prevFavs, movie];
      } else {
        prevFavs.splice(favIndex, 1);

        resultFavs = prevFavs;
      }

      return resultFavs;
    });
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData.movieName === movieCategory &&
    movieData.movieArr.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  return (
    <>
      <Slider>
        <Category>{movieData.movieName}</Category>
        <AnimatePresence
          custom={back}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={back}
            variants={rowVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.5 }}
            key={index}
          >
            <LeftBtn onClick={() => increaseIndex("prev")}>
              <FontAwesomeIcon icon={faCaretLeft} />
            </LeftBtn>
            {movieData.movieArr
              .slice(1)
              .slice(index * offset, index * offset + offset)
              .map((movie) => (
                <Box
                  key={movie.id + movieData.movieName}
                  layoutId={movie.id + movieData.movieName}
                  onClick={() => onBoxClicked(movie.id)}
                  variants={boxVars}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                >
                  <BoxImg
                    bgphoto={
                      movie.backdrop_path
                        ? makeImgPath(movie.backdrop_path, "w500")
                        : makeImgPath(movie.poster_path, "w500")
                    }
                  >
                    <BoxOverlay variants={hoverVars}>
                      <Stars>
                        <FontAwesomeIcon icon={faStar} /> &nbsp;
                        {movie.vote_average}
                      </Stars>
                      <Hearts onClick={(e) => onClickHeart(e, movie)}>
                        {favs.find((fav) => fav.id === movie.id) ? (
                          <HeartFilled style={{ color: "#ff6b81" }} />
                        ) : (
                          <HeartOutlined style={{ color: "#d9d9d9" }} />
                        )}
                      </Hearts>
                    </BoxOverlay>
                  </BoxImg>
                  <Info>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
            <RightBtn onClick={() => increaseIndex("next")}>
              <FontAwesomeIcon icon={faCaretRight} />
            </RightBtn>
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch && clickedMovie ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClick}
            />
            <BigMovie
              movieId={bigMovieMatch?.params.movieId}
              clickedMovie={clickedMovie}
              movieName={movieData.movieName}
            />
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieSlider;
