import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Wish from "./Routes/Wish";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/tv/*" element={<Tv />}>
          <Route path="tvs/:tvCategory/:tvId" element={<Tv />} />
        </Route>
        <Route path="/wish/*" element={<Wish />}>
          <Route path="wish/:wishCategory/:wishId" element={<Wish />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/*" element={<Home />}>
          <Route path="movies/:movieCategory/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
