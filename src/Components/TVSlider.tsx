import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { makeImgPath } from "../Routes/utils";
import { getGenre, ITv } from "./../api";
import {
  faCaretLeft,
  faCaretRight,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetRecoilState } from "recoil";
import { overlayState } from "./../atoms";
import { useQuery } from "react-query";
import { IGenreData } from "./MovieSlider";

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

  & :first-child {
    transform-origin: center left;
  }
  & :last-child {
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

const BigTv = styled(motion.div)`
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

interface ITvData {
  tvData: {
    tvArr: ITv[];
    tvName: string;
  };
}

function TvSlider({ tvData }: ITvData) {
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const { data: genreData } = useQuery<IGenreData>("genres", getGenre);
  const setOverlay = useSetRecoilState(overlayState);
  const navigate = useNavigate();

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = (dir: string) => {
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = tvData.tvArr.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      if (dir === "prev") {
        setBack(true);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (dir === "next") {
        setBack(false);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const onBoxClicked = (tvId: number) => {
    setOverlay(true);
    navigate(`tvs/${tvData.tvName}/${tvId}`);
  };

  const bigTvMatch = useMatch(`/tv/tvs/:tvCategory/:tvId`);

  const { scrollY } = useViewportScroll();

  const { tvCategory } = useParams();

  const onOverlayClick = () => {
    setOverlay(false);
    navigate(`/tv`);
  };

  const clickedTv =
    bigTvMatch?.params.tvId &&
    tvData.tvName === tvCategory &&
    tvData.tvArr.find((tv) => tv.id + "" === bigTvMatch.params.tvId);

  return (
    <>
      <Slider>
        <Category>{tvData.tvName}</Category>
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
            {tvData.tvArr
              .slice(1)
              .slice(index * offset, index * offset + offset)
              .map((tv) => (
                <Box
                  key={tv.id + tvData.tvName}
                  layoutId={tv.id + tvData.tvName}
                  onClick={() => onBoxClicked(tv.id)}
                  variants={boxVars}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  bgphoto={
                    tv.backdrop_path
                      ? makeImgPath(tv.backdrop_path, "w500")
                      : makeImgPath(tv.poster_path, "w500")
                  }
                >
                  <Info variants={infoVars}>
                    <h4>{tv.name}</h4>
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
        {bigTvMatch && clickedTv ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClick}
            />
            <BigTv
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigTvMatch.params.tvId + tvData.tvName}
            >
              {clickedTv && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, rgb(47, 47, 47), transparent 10%), url(${
                        clickedTv.backdrop_path
                          ? makeImgPath(clickedTv.backdrop_path)
                          : makeImgPath(clickedTv.poster_path)
                      })`,
                    }}
                  ></BigCover>
                  <BigTitle>
                    <BigText>{clickedTv.name}</BigText>
                  </BigTitle>
                  <BigDetailBox>
                    <BigDetails>
                      <BigCategory>
                        <p>개봉일</p>
                        <BigDates>{clickedTv.first_air_date}</BigDates>
                      </BigCategory>
                      <BigCategory>
                        <p>언어</p>
                        <BigLanguage>
                          {clickedTv.original_language.toUpperCase()}
                        </BigLanguage>
                      </BigCategory>

                      <BigCategory>
                        <p>장르</p>
                        <BigGenreBox>
                          {clickedTv.genre_ids.map((id) =>
                            genreData?.genres.map(
                              (g, idx) =>
                                g.id === id && (
                                  <BigGenre key={idx}>{g.name}</BigGenre>
                                )
                            )
                          )}
                        </BigGenreBox>
                      </BigCategory>
                    </BigDetails>
                    <BigRates>
                      <>
                        {[
                          ...Array(
                            Math.trunc(Math.round(clickedTv.vote_average) / 2)
                          ),
                        ].map((v, index) => (
                          <FontAwesomeIcon key={index} icon={faStar} />
                        ))}
                        {Math.trunc(Math.round(clickedTv.vote_average) % 2) ? (
                          <FontAwesomeIcon icon={faStarHalfStroke} />
                        ) : null}
                        &nbsp; <p>({`${clickedTv.vote_count}`})</p>
                      </>
                    </BigRates>
                  </BigDetailBox>
                  <BigOverview>{clickedTv.overview}</BigOverview>
                </>
              )}
            </BigTv>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TvSlider;
