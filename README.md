# README


# 목차
1. 프로젝트 개요
2. 서비스 소개
3. 아키텍쳐
4. 프로젝트 포스터

## 프로젝트 개요
기획 기간: 2024.10.10 ~ 2024.10.21 (총 12일)

개발 기간: 2024.10.22 ~ 2024.11.15 (총 25일)

팀원: 김욱현, 김태민, 염종인, 강경임

## 기술 스택
| 분류 | 기술 |
|---|---|
|Frontend|<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white"> <img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=WebRTC&logoColor=white">|
|Backend|<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=javascript&logoColor=yellow">|
|Database|<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">|
|Infra|<img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white"> <img src="https://img.shields.io/badge/MediaPipe-0097A7?style=for-the-badge&logo=MediaPipe&logoColor=white"> <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=TensorFlow&logoColor=white"> <img src="https://img.shields.io/badge/WebSpeechAPI-409EBB?style=for-the-badge&logo=WebSpeechAPI&logoColor=white">|


## 서비스 소개
서비스 소개 영상 : https://drive.google.com/file/d/1DHCoOLbcjKonwvLDpYEUP4ij9P3J7M81/view?usp=drive_link

서비스 발표 영상 : https://drive.google.com/file/d/1U7vF52thLhcsN8t_ZEPcD7AUFQNRhRKm/view?usp=sharing

## 아키텍쳐
![프로젝트 아키텍쳐](https://github.com/user-attachments/assets/37e6325b-fc17-4ae1-973f-d123704ba065)

## 프로젝트 포스터
![image](https://github.com/user-attachments/assets/44ef48aa-4ba3-4de5-ab4d-ddc658f9e3f1)


## 기술적 의사 결정
|분류|기술|
|---|---|
|**데이터베이스**|채팅, 데이터 전송|Polling / Long Polling / Web Socket|WebSocket 사용 결정|
|**백엔드 프레임워크**|Express|
|**디자인 패턴**|MVC 패턴|
|**상태관리도구**|zustand|

- SQL ? NoSQL ?  데이터베이스 선택 

프로젝트 초반, SQL을 사용하려 했으나, 데이터 관계를 재검토한 결과, 관계형 데이터베이스보다 데이터 간의 관계를 단순화하고 성능을 최적화할 수 있는 NoSQL MongoDB를 선택함. MongoDB의 BSON 형식을 활용하여 복잡한 테이블 관계를 없애고, B-Tree 인덱스를 사용해 게임 방 탐색 속도를 최적화함으로써 효율적인 데이터 관리와 처리 성능을 확보함.

- 백엔드 프레임워크 선택

Express 프레임워크를 선택하여 데이터베이스 서버를 구축한 이유는 HTTP 상태 코드를 명확히 이해하고, 클라이언트 요청에 대해 적절한 응답을 제공하기 위함
Express는 경량 프레임워크로 다양한 미들웨어와 플러그인을 활용해 필요한 기능만 선택적으로 사용하여 맞춤형 서버를 설계하고, 이를 통해 서버의 성능과 효율성을 최적화하면서 동시에 확장성과 유지보수성을 갖춤

- MVC 패턴 선택
  
코드의 재사용성, 확장성, 가독성을 높이기 위해 MVC 패턴을 선택함. 하지만 이번 프로젝트에서는 Model을 활용하지 않고 개발을 진행했는데, 그 이유는 게임의 생명 주기가 짧아 게임 한 판이 끝나면 모든 데이터를 삭제하기 때문임. 이를 통해 DB의 검색 속도를 더욱 최적화할 수 있었음.

- 소켓 서버 분리

로직에 대한 책임을 분리시키고 트래픽을 분산시키기 위해서 게임 방에 대한 정보를 관리하는 소켓과 게임을 진행하는 소켓 서버를 분리하여 구축함. 또한 특정 소켓 서버만 재배포하거나 유지보수할 수 있으므로 서비스 중단을 최소화함.

- 상태 관리 도구

게임 특성 상 실시간 상태 변경이 빈번함. zustand의 간단한 구독 메커니즘이 성능상 유리하고, Redux의 불필요한 리렌더링 방지 로직이 필요 없다는 판단하에 zustand를 선택함.


## 시간이 더 있었으면 도전하거나, 개선했을 점들
- 리플레이 기능
- 커스텀 필터 추가
- 더 다양한 게임 모드. 예를 들어, 다른 사람에게 금칙어를 유도하면 보상을 준다거나 하는 등
