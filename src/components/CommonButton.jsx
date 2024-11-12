import PropTypes from 'prop-types';
import '../styles/CommonButton.css';
import CLICKSOUND from "../assets/bgm/click.mp3";

const CommonButton = ({ text, onClick, size = "medium", className = "" }) => {
    const styles = {
        button_small: "w-24 h-40 text-sm",
        button_medium: "w-32 h-40 text-base",
        button_large: "w-100 h-40 text-lg ",
        button_input: "w-96 h-40 text-lg",  // 입력창 버튼용
    };

    // 버튼 클릭 시 오디오 재생 함수
    const handleClick = () => {
        const audio = new Audio(CLICKSOUND);
        audio.play();

        if (onClick) {
            onClick(); // 부모 컴포넌트로 전달된 onClick 핸들러 호출
        }
    };

    return (
        <button 
            onClick={handleClick}
            className={`
                ${styles[size]}
                commonButton
            `}
        >
            {text}
        </button>
    );
};

CommonButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    className: PropTypes.string,
};

export default CommonButton; 