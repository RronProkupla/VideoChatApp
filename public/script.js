

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const newVideo = document.createElement('video')
newVideo.muted = true
let videoStream 
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '8080'
}); 

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream => {
    videoStream = stream
    addVideoStream(newVideo,stream)
})

peer.on('open', id => {
    socket.emit('join-room', roomId, id)
})



const connectToNewUser = (userId) => {
    console.log(userId)
}

socket.on('user-connected', (userId) => {
    connectToNewUser(userId);
})




const addVideoStream = (video,stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () => {
        video.play()
    })

    videoGrid.append(video)
}