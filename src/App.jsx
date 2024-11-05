import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import HostGuestPage from './pages/HostGuestPage.jsx';
import HostPage from './pages/HostPage.jsx';
import GuestPage from './pages/GuestPage.jsx';
import GameRoomPage from './pages/GameRoomPage.jsx'
import TakePhotos from './pages/TakePhotos.jsx';
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/nickname" element={<NicknamePage/>} />
        <Route path="/hostguest" element={<HostGuestPage/>}/>
        <Route path='/host' element={<HostPage/>}/>
        <Route path='/guest' element={<GuestPage/>}/>
        <Route path='/gameroom' element={<GameRoomPage/>}/>
        <Route path='/gameroom' element={<TakePhotos/>}/>
        {/* <Route path="/" element={<Test/>}/> */}
    </Routes>
</BrowserRouter>
  )
}

export default App
