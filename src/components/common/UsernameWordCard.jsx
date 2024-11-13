import { PROFILE_COLORS_ARRAY } from '../../constants/colors';
import PropTypes from 'prop-types';
const UsernameWordCard = ({ user, words = '',count, playerIndex = 0,isHost = false}) => {
    return (
        !isHost && (
            <div 
                className="username-word-card"
                style={{ backgroundColor: PROFILE_COLORS_ARRAY[playerIndex] }}
            >
                <div className="username">{user}</div>
                <div className="username-word-info">
                    <div className="username-forbidden-word">
                        <div className="forbidden-word-text">{words || '금칙어 없음'}</div>
                    </div>
                </div>
                <div className="word-count">
                    <span>{count || 0}회</span> 
                </div>
            </div>
        )
    );
};

UsernameWordCard.propTypes = {
    user: PropTypes.string.isRequired,
    words: PropTypes.string,
    count: PropTypes.number,
    playerIndex: PropTypes.number.isRequired,
    isHost: PropTypes.bool,
};

export default UsernameWordCard; 