import PropTypes from 'prop-types';
import '../../styles/profileCard.css'; 
import { PROFILE_COLORS } from '../../constants/colors';
import { UsePlayerStore } from '../store/playerStore';

function ProfileCard({ nickname}) {
    const userIndex = UsePlayerStore((state) => state.userIndex);
    const userNumber = userIndex+1;
    return (
      <div className="profile-card">
        <div className="profile-info">
          {/* 프로필 이미지 */}
          <div className="profile-image-container">
              <div 
              className="profile-image-placeholder" style={{ backgroundColor: PROFILE_COLORS[`COLOR_${userNumber}`] }}>
                <div>{userNumber}</div>
              </div>
          </div>
          <div className="profile-text">
            <span className="profile-nickname">{nickname}</span>
          </div>
        </div>
      </div>
    );
}

ProfileCard.propTypes = {
   nickname: PropTypes.string.isRequired,
   imageUrl: PropTypes.string
};

export default ProfileCard;