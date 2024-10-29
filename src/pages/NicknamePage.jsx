import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const NicknamePage = () => {
 
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = () => {
      if (username.trim()) {
        navigate('/hostguest', { state: { username: username } });
      }
    };
  
    return (
        <div>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름을 입력하세요"
        />
        <button type="submit">
            다음
        </button>
        </form>
        </div>
    );
}

export default NicknamePage



