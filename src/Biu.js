import Clip from './Clip'
import Stage from './Stage'

class Biu {
    constructor(args) {
        if (typeof args.container === 'string') {
            args.container = document.querySelector(args.container)
        }
        this.requestPause = false
        this.clip = new Clip()
        this.stage = new Stage(args.container)
        this.config = {
            speed: 6000,
        }
        this.style = {
            fontFamily: 'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif',
            fontSize:   '25px',
            fontWeight: 'bold',
            padding:    '0 2px 0 2px',
            lineHeight: 1.125,
            textShadow: '0 0 1px #000',
            color:      '#fff',
        }
        this.state = 0
    }
    load(template) {
        this.clip.load(template)
    }
    start(time = 0) {
        this.state = 1
        this.clip.movePointerTo(time)
        this.startedAt = Date.now()
        this.time = time
        requestAnimationFrame(garbageCollectionFrame.bind(this))
    }
    pause() {
        this.requestPause = true
        this.pausedAt = Date.now()
    }
    resume() {
        let now = Date.now()
        this.startedAt += now - this.pausedAt
        this.stage.syncTimestamp(now - this.pausedAt)
        this.stage.resume(now)
        requestAnimationFrame(garbageCollectionFrame.bind(this))
    }
}

export default Biu

function garbageCollectionFrame() {
    this.stage.gc()
    requestAnimationFrame(renderFrame.bind(this))
}

function renderFrame() {
    let now = Date.now()
    let time = now - this.startedAt + this.time
    let danmakus = this.clip.get(time)
    this.stage.render(danmakus, this.style, now)
    requestAnimationFrame(shotFrame.bind(this))
}

function shotFrame() {
    let now = Date.now()
    this.stage.shot(now - this.startedAt, 5000, now)
    if (this.requestPause) {
        this.requestPause = false
        this.stage.pause(now)
    } else {
        requestAnimationFrame(garbageCollectionFrame.bind(this))
    }
}
