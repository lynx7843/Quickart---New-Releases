import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuickArt from './QuickArt.jsx';
import FirstNavbar from "./assets/firstnavbar";
import SecondNavbar from "./assets/Secondnavbar";
import QuickArtAI from './QuickArtAI.jsx';
import QuickArt3D from './quickart3d.jsx';
import VirtualFittingRoom from './VirtualFittingRoom.jsx';
import AllCategory from './assets/all.jsx';
import AuthBuilderUI from './AuthBuilderUI.jsx';
import Home from './assets/home.jsx';
import WebsiteBuilder from './WebsiteBuilder.jsx';

function App() {
  return (
    <BrowserRouter>
      <FirstNavbar />
      <SecondNavbar />
      <Routes>
        <Route path="/" element={<QuickArt />} />
        <Route path="/admin" element={<QuickArt />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quick-art-ai" element={<QuickArtAI />} />
        <Route path="/quickart-3d" element={<QuickArt3D />} />
        <Route path="/virtual-fitting-room" element={<VirtualFittingRoom />} />
        <Route path="/all-categories" element={<AllCategory />} />
        <Route path="/auth-builder-ui" element={<AuthBuilderUI />} />
        <Route path="/website-builder" element={<WebsiteBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;