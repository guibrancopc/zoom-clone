const onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const room = urlParams.get('room');
  console.log('this is the room', room)

  // DEV
  // const socketUrl = 'http://localhost:3000'

  // PROD
  const socketUrl = 'https://hidden-journey-38002.herokuapp.com'
  const socketBuilder = new SocketBuilder({ socketUrl })

  const peerConfig = Object.values({
    id: undefined,
    config: {
      // PROD
      host: 'morning-stream-07726.herokuapp.com',
      secure: true,

      // DEV
      // port: 9000,
      // host: 'localhost',
      path: '/'
    }
  })

  const peerBuilder = new PeerBuilder({ peerConfig })
  const view = new View()
  const media = new Media()
  const deps = {
    view,
    media,
    room,
    socketBuilder,
    peerBuilder
  }

  Business.initialize(deps)


  // view.renderVideo({ userId: 'test01', url: 'https://media.giphy.com/media/LPrAK9rEedDwjtL1J0/giphy.mp4' })
  // view.renderVideo({ userId: 'test01', isCurrentId: true, url: 'https://media.giphy.com/media/LPrAK9rEedDwjtL1J0/giphy.mp4' })
  // view.renderVideo({ userId: 'test01', url: 'https://media.giphy.com/media/LPrAK9rEedDwjtL1J0/giphy.mp4' })
}

window.onload = onload