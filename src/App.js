import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
const Chats = React.lazy(() => import("./pages/Chats"));
const Home = React.lazy(() => import("./pages/Home"));

function App() {
  // const baseUrl = process.env.REACT_APP_BASE_URL;
  // console.log(`App: ${baseUrl}`);
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
