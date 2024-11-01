import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect } from 'react';
// modals 상태 가져오기


const ForbiddenWordlistModal = ({ participantList, forbiddenWordlist, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
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
                <div className="timer">
                    <div className="progress-bar" />
                </div>
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
