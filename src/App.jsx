import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import HostGuestPage from './pages/HostGuestPage.jsx';
import GameRoomPage from './pages/GameRoomPage.jsx'
import TakePhotos from './pages/TakePhotos.jsx';
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/nickname" element={<NicknamePage/>} />
        <Route path="/hostguest" element={<HostGuestPage/>}/>
        <Route path='/gameroom' element={<GameRoomPage/>}/>
        <Route path='/photo' element={<TakePhotos/>}/>
        {/* <Route path="/" element={<Test/>}/> */}
    </Routes>
</BrowserRouter>
  )
}

export default App
