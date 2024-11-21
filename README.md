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
|Frontend|<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white">|
|Backend|<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=javascript&logoColor=yellow">|
|Database|<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">|
|Infra|<img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white"> <img src="https://img.shields.io/badge/MediaPipe-0097A7?style=for-the-badge&logo=MediaPipe&logoColor=white"> <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=TensorFlow&logoColor=white"><img src="https://img.shields.io/badge/WebSpeechAPI-409EBB?style=for-the-badge&logo=WebSpeechAPI&logoColor=white">|


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
|**Frontend**|채팅, 데이터 전송|Polling / Long Polling / Web Socket|WebSocket 사용 결정|
|**WebRTC (SFU)**|실시간 스트리밍 및 음성|HLS / Mesh / SFU / MCU|WebRTC (SFU) 사용 결정|
|**Github Action & DockerHub / AWS CodeDeploy**|지속적 통합과 지속적 배포를 통한 업무 효율 상승|Jenkins / Github Action / Travis CI|Github Action과 AWS CodeDeploy 사용 결정|
|**Zustand**|상태관리도구|redux,zustand|zustand 사용 결정|

## 시간이 더 있었으면 도전하거나, 개선했을 점들
