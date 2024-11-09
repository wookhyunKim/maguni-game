import { useNavigate } from "react-router-dom";
import '../styles/beforeGameRoom.css'
import CommonButton from '../components/CommonButton'
import mainCharacter from '../assets/images/mainImage.png'
import GameLayout from '../components/layout/GameLayout.jsx';

const HomePage = () => {
    const navigate = useNavigate();
    // const [music, setMusic] = useState(false);

    const  goToNickname = () => {
        
        navigate('/nickname');

        }
    return (
        <GameLayout>
            <div className="game-content">
                <div className="character-container">
                    <img src={mainCharacter} alt="mainCharacter" className="main-character"/>
                </div>
                <CommonButton text="시작하기" onClick={goToNickname} size="large"/>
            </div>
        </GameLayout>
    )
}

export default HomePage
