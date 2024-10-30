import { useState } from 'react';
import '../../styles/input.css';

function Input() {
const [value, setValue] = useState("");

return (
  <input
    value={value} 
    onChange={(e) => setValue(e.target.value)}
    placeholder="내용을 입력하세요"
    className="input"
  />
);
}

export default Input;