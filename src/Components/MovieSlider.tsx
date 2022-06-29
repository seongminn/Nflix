import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImgPath } from "../Routes/utils";
import { IGetMovies, IMovie } from "./../api";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Slider = styled.div`
  position: relative;
  top: -150px;
  margin-bottom: 100px;
  height: 240px;
`;

const Category = styled.p`
  padding: 0 60px;
  margin-bottom: 20px;
  font-size: 1.5vw;

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
    font-size: 18px;
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
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40%;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
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

interface IMovieData {
  movieData: IMovie[];
  name: string;
}

function MovieSlider({ movieData, name }: IMovieData) {
  const NETFLIX_LOGO_URL =
    "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);

  const navigate = useNavigate();

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = (dir: string) => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.length - 1;
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
    navigate(`/movies/${movieId}`);
  };

  const bigMovieMatch = useMatch("movies/:movieId");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);

  const { scrollY } = useViewportScroll();

  const onOverlayClick = () => {
    navigate(`/`);
  };

  return (
    <>
      <Slider>
        <Category>{name}</Category>
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
            {movieData
              .slice(1)
              .slice(index * offset, index * offset + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + name}
                  onClick={() => onBoxClicked(movie.id)}
                  variants={boxVars}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  key={movie.id + name}
                  bgphoto={
                    movie.backdrop_path
                      ? makeImgPath(movie.backdrop_path, "w500")
                      : NETFLIX_LOGO_URL
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
        {bigMovieMatch ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClick}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigMovieMatch.params.movieId + name}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieSlider;
