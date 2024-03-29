import { useRecoilState } from "recoil";
import { favsMovieState, favsTVState } from "../atoms";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImgPath } from "./utils";
import { useState } from "react";
import { HeartFilled } from "@ant-design/icons";
import { IMovie, ITv } from "../api";

const Wrapper = styled.div`
  padding: 60px;
`;

const RowCategory = styled.div`
  display: flex;
  margin: 30px 0;
`;

const Title = styled.span<{ isActive: boolean }>`
  position: relative;
  color: ${(props) => (props.isActive ? "#ffffffde" : "#696969de")};
  font-size: 16px;
  line-height: 1.47;
  font-weight: 700;
  margin-left: 20px;
  padding-left: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.1s;
  cursor: pointer;

  & + &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 1px;
    height: 1rem;
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%);
  }

  &:first-child {
    padding-left: 0;
    margin-left: 0;
  }
`;

const Rows = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
`;

const Box = styled(motion.div)`
  height: 250px;
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

const Hearts = styled.div`
  font-size: 16px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 10px;
`;

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    transition: { delay: 0, duration: 0.3, type: "tween" },
    y: -10,
  },
};

function Wish() {
  const [favsMovies, setFavsMovies] = useRecoilState(favsMovieState);
  const [favsTvs, setFavsTvs] = useRecoilState(favsTVState);
  const [curCate, setCurCate] = useState("movie");

  const onClickCate = (e: React.MouseEvent<HTMLSpanElement>) => {
    const {
      currentTarget: {
        dataset: { name },
      },
    } = e;

    console.log(name);
    setCurCate(name!);
  };

  const onClickX = (
    e: React.MouseEvent<HTMLDivElement>,
    value: any,
    category: string
  ) => {
    e.stopPropagation();
    if (category === "movie") {
      setFavsMovies((favs: IMovie[]) => {
        const prevFavs = [...favs];

        const favIndex = prevFavs.findIndex((fav) => fav.id === value.id);

        let resultFavs;
        if (favIndex === -1) {
          resultFavs = [...prevFavs, value];
        } else {
          prevFavs.splice(favIndex, 1);

          resultFavs = prevFavs;
        }

        return resultFavs;
      });
    } else {
      setFavsTvs((favs: ITv[]) => {
        const prevFavs = [...favs];

        const favIndex = prevFavs.findIndex((fav) => fav.id === value.id);

        let resultFavs;
        if (favIndex === -1) {
          resultFavs = [...prevFavs, value];
        } else {
          prevFavs.splice(favIndex, 1);

          resultFavs = prevFavs;
        }

        return resultFavs;
      });
    }
  };

  return (
    <Wrapper>
      <RowCategory>
        <Title
          onClick={onClickCate}
          data-name="movie"
          isActive={curCate === "movie"}
        >
          영화
        </Title>

        <Title onClick={onClickCate} data-name="tv" isActive={curCate === "tv"}>
          TV 프로그램
        </Title>
      </RowCategory>

      {curCate === "movie" ? (
        <Rows>
          {favsMovies.map((movie) => (
            <Box
              key={movie.id}
              variants={boxVars}
              initial="normal"
              whileHover="hover"
            >
              <BoxImg
                bgphoto={
                  movie.backdrop_path
                    ? makeImgPath(movie.backdrop_path, "w500")
                    : makeImgPath(movie.poster_path, "w500")
                }
              >
                {/* <Cancle onClick={(e) => onClickX(e, movie)}>
                  <FontAwesomeIcon icon={faXmark} />
                </Cancle> */}
                <Hearts onClick={(e) => onClickX(e, movie, "movie")}>
                  <HeartFilled style={{ color: "#ff6b81" }} />
                </Hearts>
              </BoxImg>

              <Info>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
        </Rows>
      ) : (
        <Rows>
          {favsTvs.map((tv) => (
            <Box
              key={tv.id}
              variants={boxVars}
              initial="normal"
              whileHover="hover"
            >
              <BoxImg
                bgphoto={
                  tv.backdrop_path
                    ? makeImgPath(tv.backdrop_path, "w500")
                    : makeImgPath(tv.poster_path, "w500")
                }
              >
                <Hearts onClick={(e) => onClickX(e, tv, "movie")}>
                  <HeartFilled style={{ color: "#ff6b81" }} />
                </Hearts>
              </BoxImg>
              <Info>
                <h4>{tv.name}</h4>
              </Info>
            </Box>
          ))}
        </Rows>
      )}
    </Wrapper>
  );
}

export default Wish;
