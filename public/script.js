

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const newVideo = document.createElement('video')
newVideo.muted = true
 
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '9090'
}); 

let videoStream
navigator.mediaDevices.getUserMedia({
    video: false,
    audio:false
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



const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream' , userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}




const addVideoStream = (video,stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () => {
        video.play()
    })

    videoGrid.append(video)
}