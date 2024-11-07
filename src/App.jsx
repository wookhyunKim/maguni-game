import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import HostGuestPage from './pages/HostGuestPage.jsx';
import GameRoomPage from './pages/GameRoomPage.jsx'
import EndGamepage from './pages/EndGamepage.jsx';
import FourCut from './pages/fourcut.jsx';
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/nickname" element={<NicknamePage/>} />
        <Route path="/hostguest" element={<HostGuestPage/>}/>
        <Route path='/gameroom' element={<GameRoomPage/>}/>
        <Route path='/end' element={<EndGamepage/>}/>
        {/* <Route path="/" element={<Test/>}/> */}
        <Route path='/fourcut' element={<FourCut/>}/>
    </Routes>
</BrowserRouter>
  )
}

export default App
