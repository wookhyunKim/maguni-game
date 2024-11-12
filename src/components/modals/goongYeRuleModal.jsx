import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeBGremoved.webp"
import UrgeWithPleasureComponent from '../common/UrgeWithPleasureComponet.jsx';

const ForbiddenWordlistModal = ({ participantList, forbiddenWordlist, onClose }) => {
    const { goongYeRevealForbiddenWord } = useGameStageStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, goongYeRevealForbiddenWord.sessiontime * 1000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="goongye-modal-overlay">
            <div className="goongye-modal-content">
                <img src={Goon} alt="궁예" />
                <h2>금칙어 공개</h2>
                <table className="forbidden-word-table">
                    <thead>
                        <tr>
                            <th>참가자</th>
                            <th>금칙어</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantList?.map(user => (
                            <tr key={user}>
                                <td>{user}</td>
                                <td>{forbiddenWordlist?.find(e => e.nickname === user)?.words || '금칙어 없음'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <UrgeWithPleasureComponent duration={12} />
            </div>
        </div>
    );
};

ForbiddenWordlistModal.propTypes = {
    participantList: PropTypes.array.isRequired,
    forbiddenWordlist: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ForbiddenWordlistModal;
