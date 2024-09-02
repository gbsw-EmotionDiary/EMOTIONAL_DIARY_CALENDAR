import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages";
import NotFoundPage from "./pages/404";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<IndexPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
