import { useEffect} from 'react';
import { useModalStore } from '../store/modalStore.js';
import PropTypes from 'prop-types';
import '../../styles/modals.css';

const ForbiddenWordlistModal = ({ participantList, forbiddenWordlist }) => {
    const { setModal } = useModalStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setModal('forbiddenWordlist', false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setModal]);

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
};

export default ForbiddenWordlistModal;
