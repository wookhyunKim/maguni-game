import {useEffect,useRef} from 'react'
import { joinTestSession } from '../../openvidu/app_openvidu.jsx';
import "../styles/FilterTestPage.css"
import html2canvas from "html2canvas";

function FilterTestPage() {
    const hasJoinedSession = useRef(false);
    const divRef = useRef(null);

    useEffect(() => {
        if (!hasJoinedSession.current) {
            joinTestSession("TEST", "마구니");
            hasJoinedSession.current = true;
        }
    }, [])

    const testPenalty = (filterType) => {
        handleTestPenalty(filterType);
    }

        // 메세지 보내기 - filterType을 포함하여 전송
        const handleTestPenalty = (filterType) => {
            const event = new CustomEvent('testPenaltyFilter', {
                detail: { filterType }
            });
            window.dispatchEvent(event);
        };

        const sendImage = () => {
            const date = new Date();
            const nowtime = `${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;
            
            if (divRef.current) {
                html2canvas(divRef.current).then(canvas => {
                    const imageData = canvas.toDataURL("image/png");
                    
                    // 캡처된 이미지를 페이지에 표시하기 (선택 사항)
                    const imgElement = document.createElement("img");
                    imgElement.src = imageData;
                    document.body.appendChild(imgElement);
        
                    // 이미지를 로컬에 다운로드하도록 설정 (선택 사항)
                    const link = document.createElement("a");
                    link.href = imageData;
                    link.download = `TEST_${nowtime}.png`;
                    link.click();
                    
                    console.log("이미지가 성공적으로 캡처되었습니다.");
                });
            }
        };

  return (
    <>
        <div id="main-container" className="container">
                {/* ---------- 대기실 2 ----------*/}
                <div id="join">
                </div>
                {/* ---------- Join - 게임 ----------*/}
                <div id="session">
                    <div id="session-body">
                        <div className="main-content">
                            <div className="test_button_container">
                                <>
                                    {/* <button id="penaltyTestButton" onClick={testPenalty}>벌칙 테스트</button> */}
                                    <button id="penaltyTestButton" onClick={() => testPenalty('eyeFilter')}>눈 필터 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('mustacheFilter')}>수염 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('baldFilter')}>머리 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('fallingImage')}>접시 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('goongYe')}>배경 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('mouthFilter')}>입 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('faceOutlineFilter')}>얼굴외각 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('noseEnlarge')}>코 왜곡 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('smile')}>입 왜곡 테스트</button>
                                    <button id="penaltyTestButton" onClick={() => testPenalty('foreHead')}>이마 왜곡 테스트</button>
                                            
                                </>
                            </div>
                            <div id="video-container" className="col-md-6" ref={divRef}></div>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default FilterTestPage
