class PeerBuilder {
  constructor({ peerConfig }) {
    this.peerConfig = peerConfig

    const defaultFn = () => {}
    this.onError = defaultFn
    this.onCallReceived = defaultFn
    this.onConnectionOpened = defaultFn
    this.onPeerStreamReceived = defaultFn
    this.onCallError = defaultFn
    this.onCallClose = defaultFn
  }

  setOnCallError(fn) {
    this.onCallError = fn
    return this
  }

  setOnCallClose(fn) {
    this.onCallClose = fn
    return this
  }

  setOnError(fn) {
    this.onError = fn
    return this
  }

  setOnCallReceived(fn) {
    this.onCallReceived = fn
    return this
  }

  setOnConnectionOpened(fn) {
    this.onConnectionOpened = fn
    return this
  }

  setOnPeerStreamReceived(fn) {
    this.onPeerStreamReceived = fn
    return this
  }

  _prepareCallEvent(call) {
    call.on('stream', stream => this.onPeerStreamReceived(call, stream))
    call.on('error', error => this.onCallError(call, error))
    call.on('close', _ => this.onCallClose(call))

    this.onCallReceived(call)
  }

  // adicionar o comportamento dos eventos de call também para quem ligar!
  _preparePeerInstanceFuncion(peerModule) {
    class PeerCustomModule extends peerModule {}

    const peerCall = PeerCustomModule.prototype.call
    const context = this
    PeerCustomModule.prototype.call = function (id, stream) {
      const call = peerCall.apply(this, [ id, stream ])

      // aqui acontece a magia, interceptamos o call e adicionamos
      // todos os eventos da chamada pra quem liga também
      context._prepareCallEvent(call)

      return call
    }

    return PeerCustomModule
  }


  build() {
    // const peer = new Peer(...this.peerConfig)

    const PeerCustomInstance = this._preparePeerInstanceFuncion(Peer)
    const peer = new PeerCustomInstance(...this.peerConfig)

    peer.on('error', this.onError)
    peer.on('call', this._prepareCallEvent.bind(this)) // Entender melhor o que é isso

    return new Promise(resolve => peer.on('open', id => {
      this.onConnectionOpened(peer)
      return resolve(peer)
    }))
  }
}