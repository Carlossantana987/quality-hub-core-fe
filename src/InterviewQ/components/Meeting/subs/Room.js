import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import '../Meeting.scss';

const Room = () => {
    const [textchat, setTextchat] = useState('');
    const [theParty, setTheParty] = useState(false);
    // var theParty = false;
        // const [constraints, setConstraints] = useState({
        //     let constraints = {
        //     audio: true,
        //     video:
        //     {
        //         mandatory: {
        //             minWidth: 500,
        //             maxWidth: 500,
        //             minHeight: 500,
        //             maxHeight: 500,
        //         }
        //     }
        // });

    const handleChange = e =>{
        e.preventDefault();
        setTextchat(e.target.value);
    }

    // io = io.connect();
    var myVideoArea = document.querySelector("#myVideoTag");
    var theirVideoArea = document.querySelector("#theirVideoTag");
    // var myName = document.querySelector('#myName')
    var myMessage = document.querySelector('#myMessage')
    var sendMessage = document.querySelector('#sendMessage')
    // var chatArea = document.querySelector('#chatArea')
    var signalingArea = document.querySelector("#signalingArea")
    
    let io = socketIOClient.connect('https://qh-test-web-rtc.herokuapp.com'); 
    // let io = socketIOClient.connect('http://localhost:4000'); 
    // var ROOM = "chat";
    var ROOM = `${window.localStorage.getItem('uniquecheckid')}z`;
    var SIGNALING_ROOM = window.localStorage.getItem('uniquecheckid');
    // var SIGNALING_ROOM = 'room_name'
    var configuration = {
        'iceServers': [{
            'url': 'stun:stun.l.google.com:19302'
        }]
    };
    var rtcPeerConn;
    var constraints = {
        audio: true,
        video:
        {
            mandatory: {
                minWidth: 500,
                maxWidth: 500,
                minHeight: 500,
                maxHeight: 500,
            }
        }
    };

    var videoProps = {
        mandatory: {
            minWidth: 500,
            maxWidth: 500,
            minHeight: 500,
            maxHeight: 500,
        }
    }
    var [announcements, setAnnouncements] = useState([]);
    
    function onError(error) {
        console.log("Error!", error)
    }

    // function startStream() {
    //     // Sets navigator.mediaDevices.getUserMedia based on browser type [chrome, firefox, mozilla].
    //     navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
    //     navigator.mediaDevices.getUserMedia(constraints)
    //     .then((stream) => {
    //         document.querySelector("#myVideoTag").srcObject = stream;
    //         rtcPeerConn.addStream(stream)
    //         document.querySelector("#myVideoTag").play();
    //         console.log("Success! We have a stream!");
    //     })
    //     .catch(onError);
    // }
    
    function startSignaling() {
        displaySignalingMessage('staring signaling...')
        
        rtcPeerConn = new RTCPeerConnection(configuration);
        // rtcPeerConn = new webkitRTCPeerConnection(configuration)
        
        rtcPeerConn.onicecandidate = function(event) {
            if (event.candidate) {
                io.emit('signal', {"type": "ice candidate", "message": JSON.stringify({
                    'candidate': event.candidate,
                    'room': SIGNALING_ROOM
                })})
            }
            displaySignalingMessage("completed that ice candidate...")
        }
        
        rtcPeerConn.onnegotiationneeded = function() {
            displaySignalingMessage("on negotiation called")
            rtcPeerConn.createOffer(sendLocalDesc, logError);
        }

        rtcPeerConn.onaddstream = function(event) {
            displaySignalingMessage("going to add their stream...")
            document.querySelector("#theirVideoTag").srcObject = event.stream
        }
        
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            document.querySelector("#myVideoTag").srcObject = stream
            rtcPeerConn.addStream(stream)
            document.querySelector("#myVideoTag").play();
          
            // console.log("Success! We have a stream!");
        })
        .catch(onError);
    }
    
    function sendLocalDesc(desc) {
        rtcPeerConn.setLocalDescription(desc, function () {
            displaySignalingMessage("sending local description");
            io.emit('signal', {
                "type":"SDP",
                "message": JSON.stringify({
                    'sdp': rtcPeerConn.localDescription
                }),
                "room": SIGNALING_ROOM
            })
        }, logError)
    }

    function logError(error) {
        displaySignalingMessage(error.name + ': ' + error.message);
    }
    
    function displayMessage(message) {
        document.querySelector('#chatArea').textContent += "\r\n"  + message;
        document.querySelector('#chatArea').setAttribute('style', 'white-space: pre;');
        document.querySelector('#chatArea').scrollTop = 10000000;
        // chatArea.textContent = chatArea.textContent + "<br/>" + message;
    }
    
    function displaySignalingMessage(message) {
        // console.log(message)
        // signalingArea.setAttribute('style', 'white-space: pre;');
        // signalingArea.textContent += '\r\n' + message;
    }

    function restartStream() {
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            document.querySelector("#myVideoTag").srcObject = stream
            rtcPeerConn.addStream(stream)
            document.querySelector("#myVideoTag").play();
        })
        .catch(onError);
    }

    function toggleAudio() {
        constraints.audio = !constraints.audio
        restartStream()
    }

    function toggleVideo () {
        // console.log(constraints);
        // console.log(constraints.video);
        // console.log(constraints.audio);
        // constraints.video === false ? constraints.video = videoProps : constraints.video = false
        // if(constraints.video === false && constraints.audio === false){
        //     // console.log('RIGHT HERE')

        //     navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
            

        //     navigator.mediaDevices.getUserMedia({
        //         audio: true,
        //         video:
        //         {
        //             mandatory: {
        //                 minWidth: 500,
        //                 maxWidth: 500,
        //                 minHeight: 500,
        //                 maxHeight: 500,
        //             }
        //         }
        //     })
        //     .then(stream => {
        //         stream.getTracks().forEach(track=>{
        //             console.log(track)
        //             stream.
        //             // stream.removeTrack(track);
        //             // track.muted = true;
        //             // track.enabled = false;
        //         })
        //         console.log('hi')
        //         //     console.log("MEOW MEOW")
        //         // document.querySelector("#myVideoTag").srcObject = stream;
        //         rtcPeerConn.addStream(stream)
        //         // rtcPeerConn.removeStream(stream);
        //         // document.querySelector("#myVideoTag").play();
        //     })
        //     .catch(onError);
        // } else {

            constraints.video === false ? constraints.video = videoProps : constraints.video = false
            restartStream()
        // }
    }

    const sendMessageFunction = (e) =>{
        e.preventDefault();
        if(document.querySelector("#myMessage").value != ""){

            displayMessage(`User : ${document.querySelector('#myMessage').value}`)
            io.emit('send', {"author":"User", "message": document.querySelector('#myMessage').value, "room":SIGNALING_ROOM});
            document.querySelector("#myMessage").value = "";
        }
    }

    function start() {
        
        io.emit('ready', {"chat_room": ROOM, "signaling_room": SIGNALING_ROOM, "my_name":"Ryan"});
        
        io.emit('signal', {"type": "user_here", "message": "Are you ready for a call?", "room": SIGNALING_ROOM});
        
        io.on('signaling_message', data => {
            displaySignalingMessage("Signal received: " + data.message)
            if (!rtcPeerConn) {
                startSignaling()
                // setTimeout(startSignaling, 5000)
            }
            
            if (data.type !== "user_here") {
                var message = JSON.parse(data.message);
                if (message.sdp) {
                    rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function() {
                        if (rtcPeerConn.remoteDescription.type === 'offer') {
                            rtcPeerConn.createAnswer(sendLocalDesc, logError)
                        }
                    }, logError)
                }
                else {
                    rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate))
                }
            }
        })

        // io.on('connection', data=>{
            //     console.log('connected on the frontend')
        // })
        io.on('announce', data => {
            // setAnnouncements([...announcements, data.message]);
            displayMessage(data.message)
        })

        
        
        // sendMessage.addEventListener('click', event => {
            //     io.emit('send', {"author":document.querySelector('#myName').value, "message": document.querySelector('#myMessage').value, "room":ROOM});
            //     event.preventDefault();
            // }, false);
            
            

        io.on('message', data => {
            
            displayMessage(data.author + ": " + data.message)
        })
    
    }

    function startTheParty() {
        //What will this do?!
        setTheParty(true);
        start()
        //The party is not the the party.... HMmmmmmmMM...
    }
    // setTimeout(start, 3000)
    // start();
    // const second = () =>{
    //     setTimeout(start, 3000);
    // }

    // setTimeout(second, 3000);


	return (
        <div>
            <p>Meeting will begin at 7:00 PM EST</p>
            <button className="begin-interview-button" onClick={startTheParty}>Click here to begin interview</button>
            {/* <h1>Sexy erotic quail chat cam squirt show</h1> */}
            {(theParty) && (
            <>
                <div className="interviewq-two-video-screens">
                    <video id="myVideoTag" autoPlay="true" muted="muted"></video>
                    <video id="theirVideoTag" autoPlay="true"></video>
                    <div className="interviewq-video-controls">
                        <button onClick={toggleVideo}>Video off/on</button>
                        <button onClick={toggleAudio}>Mute</button>
                        <button onClick={''}>End</button>
                    </div>
                </div>
                <div className="the-secret-is-cumin">
                    {/* <label>Your Name</label><input id="myName" type="text" /> */}
                    <div id="chatArea" className="interviewq-meeting-chatbox">
                        This is your awesome conversation: 
                    </div>
                    <div id="signalingArea"></div>
                    <form>
                        <label>Your Message</label><input id="myMessage" type="text"/>
                        <input id="sendMessage" type="submit" onClick={sendMessageFunction}/>
                    </form>
                    <footer>copyright</footer>
                </div>
            </>
            )}           
            
        </div>
	);
};

export default Room;