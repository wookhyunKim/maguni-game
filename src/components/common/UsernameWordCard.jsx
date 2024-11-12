import { PROFILE_COLORS_ARRAY } from '../../constants/colors';
import '../../styles/UsernameWordCard.css'
import PropTypes from 'prop-types';
const UsernameWordCard = ({ user, words = '', playerIndex = 0}) => {
    return (
        <div 
            className="username-word-card"
            style={{ backgroundColor: PROFILE_COLORS_ARRAY[(playerIndex)] }}
        >
            <div className="username">{user}</div>
            <div className="word-info">
                <div className="forbidden-word">
                    <span>금칙어:</span> {words || '금칙어 없음'}
                </div>
                {/* <div className="word-count">
                    <span>사용 횟수:</span> {count || 0}
                </div> */}
            </div>
        </div>
    );
};

UsernameWordCard.propTypes = {
    user: PropTypes.string.isRequired,
    words: PropTypes.string,
    count: PropTypes.number,
    playerIndex: PropTypes.number.isRequired
};

export default UsernameWordCard; 