
const GameRoomPage = () => {
  return (
    <>
	<nav class="navbar navbar-default">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand" href="/"><img class="demo-logo"
						src="resources/images/openvidu_vert_white_bg_trans_cropped.png" /> JS</a>
				<a class="navbar-brand nav-icon"
					href="https://github.com/OpenVidu/openvidu-tutorials/tree/master/openvidu-js"
					title="GitHub Repository" target="_blank"><i class="fa fa-github" aria-hidden="true"></i></a>
				<a class="navbar-brand nav-icon" href="http://www.docs.openvidu.io/en/stable/tutorials/openvidu-js/"
					title="Documentation" target="_blank"><i class="fa fa-book" aria-hidden="true"></i></a>
			</div>
		</div>
	</nav>

	<div id="main-container" class="container">
		<div id="join">
			<div id="img-div"><img src="resources/images/openvidu_grey_bg_transp_cropped.png" /></div>
			<div id="join-dialog" class="jumbotron vertical-center">
				<h1>Join a video session</h1>
				<form class="form-group" onsubmit="joinSession(); return false">
					<p>
						<label>Participant</label>
						<input class="form-control" type="text" id="userName" required/>
					</p>
					<p>
						<label>Session</label>
						<input class="form-control" type="text" id="sessionId" required/>
					</p>
					<p class="text-center">
						<input class="btn btn-lg btn-success" type="submit" name="commit" value="Join!"/>
					</p>
				</form>
			</div>
		</div>

		<div id="session" style="display: none;">
			<div id="session-header">
				<h1 id="session-title"></h1>
				<input class="btn btn-large btn-danger" type="button" id="buttonLeaveSession" onmouseup="leaveSession()"
					value="Leave session"/>
			</div>
			<div id="main-video" class="col-md-6">
				<p></p><video autoplay playsinline="true"></video>
				<div style="margin: 10px;">
					<button id="startButton">게임 시작</button>
					<button id="stopButton" disabled>게임 종료</button>
					<div id="count">"금칙어(아니)" 카운트: 0</div> <!-- "아니" 카운트 표시 -->
				</div>
			</div>
			<div id="video-container" class="col-md-6"></div>
			<div id="subtitles" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; font-size: 18px; z-index: 1000;">
				자막
			</div>
		</div>
	</div>

	<footer class="footer">
		<div class="container">
			<div class="text-muted">OpenVidu © 2022</div>
			<a href="http://www.openvidu.io/" target="_blank"><img class="openvidu-logo"
					src="resources/images/openvidu_globe_bg_transp_cropped.png" /></a>
		</div>
	</footer>
    </>
  )
}

export default GameRoomPage
