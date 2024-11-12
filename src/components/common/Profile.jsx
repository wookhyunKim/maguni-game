import HostImage from '../../assets/images/hostAvatar.png';
import GuestImage from '../../assets/images/guestAvatar.png';
import PropTypes from 'prop-types';
import '../../styles/profile.css';
import nextButton from '../../assets/images/nextButton.png';
import { useEffect, useState } from 'react';
import CLICKSOUND from '../../assets/bgm/click.mp3';

const Profile = ({role, btnName, setRole, withInput, generatedCode, generateRoomCode, connectBtnHandler, roomcode, setRoomcode}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    connectBtnHandler();
  };

  const playClickSound = () => {
    const audio = new Audio(CLICKSOUND);
    audio.volume = 1.0;
    audio.play();
  };

  // HOST 버튼 핸들러
  const handleHostClick = () => {
    playClickSound();
    setRole('host');
  };

  // GUEST 버튼 핸들러
  const handleGuestClick = () => {
    playClickSound();
    setRole('participant');
  };

  const [RC,setRC] = useState(roomcode)

  // role이 GUEST일 때 roomcode를 초기화
  useEffect(() => {
    if (role === "GUEST") {
        setRC('');
    }
  }, []);

  return (
    <div className='profileContainer'>
        <img className="image" 
        src={role === "HOST" ? HostImage : GuestImage} 
        style={{ 
          width: '150px', 
          height: '150px'
        }}
        />
        <div className="descript">
            
            {withInput ? 
            (
                <>
                    <div className="identity">
                        {/* <img className='identityText' src={role === "HOST" ? host_text : guest_text}/> */}
                        <span className='identityText'>
                            {role === "HOST" ? " 방장 마구니 " : "손님 마구니"}
                        </span> 
                    </div>
                    <div className="border-line"/>
                    <div className='underBorderlineContainer'>
                    {role === "HOST" ? 

                    (   
                        <form className='profileInputContainer' onSubmit={handleSubmit}>
                            <input
                            value={generatedCode || generateRoomCode()}
                            readOnly
                            placeholder="방 코드 (자동 생성됨)"
                            />
                            <img className='nextButton'src={nextButton} onClick={connectBtnHandler} type="submit"></img>
                        </form>
                    )
                    : 

                    (
                        <form className='profileInputContainer' onSubmit={handleSubmit}>
                            <input
                            value={RC}
                            onChange={(e) => {
                                const newValue = e.target.value.toUpperCase();
                                setRoomcode(newValue); // roomcode 업데이트
                                setRC(newValue);       // RC 상태도 업데이트하여 화면에 반영
                            }}
                            placeholder="방 코드를 입력하세요"
                            className="room-code-input"
                            />
                            <img className='nextButton' src={nextButton} onClick={connectBtnHandler} type="submit"></img>
                        </form>
                    )}
                    </div>
                </>
            ) 

            : 

            (
                <>
                    <div className="identity">
                        <span className='identityText'>
                            {role === "HOST" ? " 방장 마구니 " : "손님 마구니"}
                        </span>
                    </div>
                    <div className="border-line"/>
                    <div className='underBorderlineContainer'>
                    {role === "HOST" ? 

                        (
                            <button className="commonButton" onClick={handleHostClick}>{btnName}</button> 
                        )
                        : 

                        (
                            <button className="commonButton" onClick={handleGuestClick}>{btnName}</button>
                        )}
                    </div>
                </>
            )}
            
        </div>
    </div>
  )
}

Profile.propTypes = {
    role: PropTypes.string.isRequired,
    btnName: PropTypes.string.isRequired,
    setRole: PropTypes.func.isRequired,
    withInput: PropTypes.bool.isRequired,
    generatedCode: PropTypes.string,
    generateRoomCode: PropTypes.func,
    connectBtnHandler: PropTypes.func,
    roomcode: PropTypes.string,
    setRoomcode: PropTypes.func
}

export default Profile
