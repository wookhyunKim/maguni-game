import HostImage from '../../assets/images/hostAvatar.png';
import GuestImage from '../../assets/images/guestAvatar.png';
import PropTypes from 'prop-types';
import '../../styles/profile.css';
import nextButton from '../../assets/images/nextButton.png';

const Profile = ({role, btnName, setRole, withInput, generatedCode, generateRoomCode, connectBtnHandler, roomcode, setRoomcode}) => {
  return (
    <div className='profileContainer'>
        <img className="image" 
        src={role === "HOST" ? HostImage : GuestImage} 
        style={{ 
          width: '200px', 
          height: '200px'
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
                        <div className='profileInputContainer'>
                            <input
                            value={generatedCode || generateRoomCode()}
                            readOnly
                            placeholder="방 코드 (자동 생성됨)"
                            />
                            <img src={nextButton} onClick={connectBtnHandler}></img>
                        </div>
                    )
                    : 

                    (
                        <div className='profileInputContainer'>
                            <input
                            value={roomcode}
                            onChange={(e) => setRoomcode(e.target.value.toUpperCase())}
                            placeholder="방 코드를 입력하세요"
                            />
                            <img src={nextButton} onClick={connectBtnHandler}></img>
                        </div>
                    )}
                    </div>
                </>
            ) 

            : 

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
                            <button onClick={() => setRole('host')}>{btnName}</button> 
                        )
                        : 

                        (
                            <button onClick={() => setRole('participant')}>{btnName}</button>
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
