import Input from '../common/Input';

const GameSidebar = ({
    username,
    roomcode,
    participantList,
    setParticipantList,
    isWordsShown,
    forbiddenWordlist,
    forbiddenWordCount,
    quitGame
}) => {
    return (
        <div className="gameroom-sidebar">
            <div className="sidebar_wordlist">
                <div className="sidebar_index">금칙어 목록</div>
                <div className="sidebar_content">
                    <table className="user-wordlist-table">
                        <tbody>
                            <ul>
                                {isWordsShown && participantList
                                    .filter(user => user !== username)
                                    .map(user => (
                                        <li key={user}>
                                            <div>
                                                {user} - {forbiddenWordlist.find(e => e.nickname === user)?.words || '금칙어 없음'}
                                                - 금칙어 카운트: {forbiddenWordCount[user] || 0}
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="sidebar_mymission">
                <div className="sidebar_index">나의 미션</div>
                <div className="sidebar_content">
                    <div className="footer-input">
                        <Input 
                            username={username} 
                            roomcode={roomcode} 
                            participantList={participantList} 
                            setParticipantList={setParticipantList}
                        />
                    </div>
                </div>
                <div className="sidebar-btn">
                <input 
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={quitGame}
                    value="나가기" 
                />
            </div>
            </div>
        </div>
    );
};

export default GameSidebar; 