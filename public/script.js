

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const newVideo = document.createElement('video')
newVideo.muted = true

const peers = {}
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '9090'
}); 

let videoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream => {
    videoStream = stream
    addVideoStream(newVideo,stream)

    peer.on('call' , call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream)
        })

        
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId,stream);
    })

 
    
    
})

peer.on('open', id => {
    socket.emit('join-room', roomId, id)
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })



const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream' , userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
      })

    peers[userId] = call
}




const addVideoStream = (video,stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () => {
        video.play()
    })

    videoGrid.append(video)
}


let input = document.querySelector('#messageinput')

input.addEventListener('keydown', (e) => {
    if(e.keyCode == 13 && input.value != 0 ){
        socket.emit('message', input.value)
        input.value = ''
    }
})


socket.on('deliverMessage', (message,userId) => {
    document.querySelector('.messages').appendChild(createSingleMessage(message,userId))
})




const createSingleMessage = (message,userId) => {
    let li = document.createElement('li')
    li.setAttribute("class", "singleMessage")
    li.textContent = `${userId} : ${message}`
    return li
}

const muteMic = () => {
    const on  = '<i class="fa fa-microphone fa-2x" style="color: white;" aria-hidden="true"></i>'
    const off = '<i class="fa fa-microphone-slash fa-2x" style="color: white;" aria-hidden="true"></i>'
    const micOn = videoStream.getAudioTracks()[0].enabled
    if(micOn){
        videoStream.getAudioTracks()[0].enabled = false
        document.querySelector('.microphone').innerHTML = off

    }else{
        videoStream.getAudioTracks()[0].enabled = true
        document.querySelector('.microphone').innerHTML = on
    }
}

const cameraToggle = () => {
    const camOn = videoStream.getVideoTracks()[0].enabled
    if(camOn){
        videoStream.getVideoTracks()[0].enabled = false  

    }else{
        videoStream.getVideoTracks()[0].enabled = true
    }
}
