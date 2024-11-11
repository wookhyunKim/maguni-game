import PropTypes from 'prop-types';
import '../../styles/modals.css';
import { useEffect, useState } from 'react';
import useGameStageStore from '../store/gameStage.js';
import Goon from "../../assets/images/goongYeBGremoved.png"
import {UsePlayerStore } from '../store/playerStore.js';
import UrgeWithPleasureComponent from '../common/UrgeWithPleasureComponet.jsx';

// 이미지 미리 로딩
const preloadImage = new Image();
preloadImage.src = Goon;

const ForbiddenWordlistModal = ({ participantList, forbiddenWordlist, onClose }) => {
    const { goongYeRevealForbiddenWord } = useGameStageStore();
    const { username } = UsePlayerStore();

    useEffect(() => {
        const img = new Image();
        img.src = Goon;
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // 4초로 고정

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img 
                    src={Goon} 
                    alt="궁예"
                    style={{ 
                        height: 'auto',
                    }}
                />
                <h2>금칙어 공개</h2>
                <table className="forbidden-word-table">
                    <thead>
                        <tr>
                            <th>참가자</th>
                            <th>금칙어</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantList
                            ?.filter(user => user !== username)
                            .map(user => (
                            <tr key={user}>
                                <td>{user}</td>
                                <td>{forbiddenWordlist?.find(e => e.nickname === user)?.words || '금칙어 없음'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <UrgeWithPleasureComponent duration={3} />
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
