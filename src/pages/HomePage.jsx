import { useNavigate } from "react-router-dom";
import '../styles/beforeGameRoom.css'
import CommonButton from '../components/CommonButton'
import mainCharacter from '../assets/images/mainImage.png'

const HomePage = () => {
    const navigate = useNavigate();
    const  goToNickname = () => {
        navigate('/nickname');
        }
    return (
    <div className="beforeGameRoomBody">
        <div className="game-container ">
            <div className="game-content">
                <h1 className='game-title text-center text-5xl text-'>금칙어 게임</h1>
                <div className="character-container">
                    <img src={mainCharacter} alt="mainCharacter" className="main-character"/>
                </div>
                <CommonButton text="시작하기" onClick={goToNickname} size="large"/>
            </div>
        </div>
    </div>
    )
}

export default HomePage
