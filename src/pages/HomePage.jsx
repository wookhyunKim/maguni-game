import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const  gotonickname = () => {
        navigate('http://localhost:5173');
        }
    return (
    <div className="game-container">
        <div className="game-content">
            <h1 className='game-title text-center text-5xl text-'>금칙어 게임</h1>
            <div className="character-container"></div>
        <button onClick={gotonickname}>시작하기</button>
        </div>
    </div>
    )
}

export default HomePage
