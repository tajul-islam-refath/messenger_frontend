import { Routes, Route } from "react-router-dom";
import "./App.css";
import Chats from "./pages/Chats";
import Home from "./pages/Home";

function App() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  console.log(`App: ${baseUrl}`);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
