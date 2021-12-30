class Bullet {
    constructor(stage) {
        // 通用属性
        this.dom     = document.createElement('div')
        this.stage   = stage
        this.danmaku = undefined
        this.width   = undefined
        this.height  = undefined
        this.track   = undefined

        // 滚动弹幕属性
        this.distance  = undefined
        this.startedAt = undefined
        this.speed     = undefined
        this.pauseTime = 0
    }
    init(danmaku, style) {
        this.danmaku = danmaku
        this.dom.innerText = danmaku.text
        this.dom.style.cssText = ''
        Object.assign(this.dom.style, style, danmaku.style, {
            webkitUserSelect: 'none',
            userSelect:       'none',
            position:         'absolute',
            whiteSpace:       'pre',
            pointerEvents:    'none',
            display:          'inline-block',
            visibility:       'hidden',
        })
        if (danmaku.type === 1) {
            this.pauseTime = 0
            this.dom.style['left'] = this.stage.width + 'px'
            this.dom.style['willchange'] = 'transform'
        } else if (danmaku.type === 2 || danmaku.type === 3) {
            this.dom.style['left'] = '50%'
            this.dom.style['transform'] = 'translateX(-50%)'
        }
    }
    shot(time, speed, now = Date.now()) {
        let offset = time - this.danmaku.time,
            begin  = now - offset,
            end    = begin + speed
        if (this.danmaku.type === 1) {
            let t = speed * this.width / (this.stage.width + this.width)
            this.startedAt = now
            this.track = this.stage.tracks.rolling.get(this.height, begin, begin + t, end - t, end)
            this.distance = this.stage.width + this.width
            this.dom.style['top'] = this.track.top + 'px'
            this.dom.style['transform'] = 'translateX(-' + this.distance + 'px) translateZ(0)'
            this.dom.style['transition'] = 'transform ' + speed + 'ms linear'
        } else if (this.danmaku.type === 2) {
            this.track = this.stage.tracks.top.get(this.height, begin, begin, begin, end)
            this.dom.style['top'] = this.track.top + 'px'
        } else if (this.danmaku.type === 3) {
            this.track = this.stage.tracks.bottom.get(this.height, begin, begin, begin, end)
            this.dom.style['top'] = (this.stage.height - this.track.top - this.height) + 'px'
        }
        this.dom.style['visibility'] = ''
        this.finish = now + speed
        this.speed = speed
    }
    updateRect() {
        let {width, height} = this.dom.getBoundingClientRect()
        this.width  = width
        this.height = height
    }
    pause(now) {
        if (this.danmaku.type !== 1) { return }
        let already = (now - this.startedAt - this.pauseTime) / this.speed * this.distance
        this.dom.style['transform']  = 'translateX(-' + already + 'px)'
        this.dom.style['transition'] = ''
    }
    resume(now) {
        if (this.danmaku.type !== 1) { return }
        let age = now - this.startedAt - this.pauseTime
        this.dom.style['transform']  = 'translateX(-' + this.distance + 'px) translateZ(0)'
        this.dom.style['transition'] = 'transform ' + (this.speed - age) + 'ms linear'
    }
    free() {
        this.track.count--
        this.dom.style.cssText = 'display:none'
    }
}

export default Bullet
