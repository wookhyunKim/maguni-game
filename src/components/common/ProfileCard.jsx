import PropTypes from 'prop-types';
import '../../styles/profileCard.css'; 
import { PROFILE_COLORS } from '../../constants/colors';
import { UsePlayerStore } from '../store/playerStore';

function ProfileCard({ nickname, playerNumber }) {
    const userIndex = UsePlayerStore((state) => state.userIndex);
    const userNumber = userIndex+1;
    return (
      <div className="profile-card">
        <div className="profile-info">
          {/* 프로필 이미지 */}
          <div className="profile-image-container">
            {/* {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="프로필" 
                className="profile-image"
              />
            ) : ( */}
              <div 
              className="profile-image-placeholder" style={{ backgroundColor: PROFILE_COLORS[`COLOR_${playerNumber}`] }}>
                <div>{userNumber}</div>
              </div>
            {/* )} */}
          </div>
          
          {/* 텍스트 정보 */}
          <div className="profile-text">
            <span className="profile-nickname">{nickname}</span>
            <span className="profile-number">정 {playerNumber}품</span>
          </div>
        </div>
      </div>
    );
}

ProfileCard.propTypes = {
   nickname: PropTypes.string.isRequired,
   playerNumber: PropTypes.number.isRequired,
   imageUrl: PropTypes.string
};

export default ProfileCard;