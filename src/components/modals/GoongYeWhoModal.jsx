import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect} from 'react';
import GoongDance from "../../assets/images/goongyedance.gif"
// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = GoongDance;

const GoongYeWhoModal = ({onClose }) => {

    useEffect(() => {
        const img = new Image();
        img.src = GoongDance;
    }, []);

    useEffect(() => {
        
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // 4초로 고정

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="goongye-modal-overlay">
            <div className="goongye-modal-content">
                {/* 카운트 하는 애니메이션 추가 예정 */}
                <img className="goongye-dance"
                    src={GoongDance} 
                    alt="궁예"
                />
            </div>
        </div>
    );
};

GoongYeWhoModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default GoongYeWhoModal;