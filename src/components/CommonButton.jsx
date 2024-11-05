import PropTypes from 'prop-types';
import '../styles/CommonButton.css'

const CommonButton = ({ text, onClick, size = "medium", className = "" }) => {
    const styles = {
        button_small: "w-24 h-40 text-sm",
        button_medium: "w-32 h-40 text-base",
        button_large: "w-100 h-40 text-lg ",
        button_input: "w-96 h-40 text-lg",  // 입력창 버튼용
    };

    return (
        <button 
            onClick={onClick}
            className={`
                ${styles[size]}
                ${className}
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