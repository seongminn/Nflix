import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { makeImgPath } from "../Routes/utils";
import { IMovie } from "./../api";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetRecoilState } from "recoil";
import { overlayState } from "./../atoms";
import BigMovie from "./BigMoive";

const Slider = styled.div`
  position: relative;
  top: -150px;
  margin-bottom: 100px;
  height: 200px;
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

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-color: white;
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  border-radius: 5px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 14px;
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
    scale: 1.3,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
    y: -50,
  },
};

const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
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
            transition={{ type: "tween", duration: 1 }}
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
                  bgphoto={
                    movie.backdrop_path
                      ? makeImgPath(movie.backdrop_path, "w500")
                      : makeImgPath(movie.poster_path, "w500")
                  }
                >
                  <Info variants={infoVars}>
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
