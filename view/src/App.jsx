import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";

import Home from "./pages/home/Home";
import Presence from "./pages/presence/Presence";
import Error from "./pages/error/Error";
import Workers from "./pages/workers/Workers";
import UpdateWorker from "./pages/workers/components/update/UpdateWorker";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>  
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/workers">
            <Route path="update/:workerCode" element={<UpdateWorker/>} />
            <Route path="" element={<Workers />} />
          </Route>
          <Route path="/presence" element={<Presence/>} />
          <Route path="*" element={<Error/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
