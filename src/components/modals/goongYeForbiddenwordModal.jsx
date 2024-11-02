import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeImage.png"

const GoongYeForbiddenWordModal = ({ participantList, forbiddenWordlist, onClose }) => {
    const { goongYeRevealForbiddenWord } = useGameStageStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, goongYeRevealForbiddenWord.sessiontime * 1000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img src={Goon}/>
                <h2>금칙어 세팅 5초</h2>
                <table className="forbidden-word-table">
                    <tbody>
                        {participantList?.map(user => (
                            <tr key={user}>
                                <td>{user}</td>
                                <td>{forbiddenWordlist?.find(e => e.nickname === user)?.words || '금칙어 없음'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="timer">
                    <div className="progress-bar" />
                </div>
            </div>
        </div>
    );
};

GoongYeForbiddenWordModal.propTypes = {
    participantList: PropTypes.array.isRequired,
    forbiddenWordlist: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GoongYeForbiddenWordModal;
