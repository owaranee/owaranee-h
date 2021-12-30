import Track from './Track'
import Bullet from './Bullet';

class Stage {
    /**
     * 创建 Stage 对象
     * @param {HTMLElement} container 
     */
    constructor(container) {
        this.dom = document.createElement('div')
        Object.assign(this.dom.style, {
            position:      'relative',
            width:         '100%',
            height:        '100%',
            overflow:      'hidden',
            pointerEvents: 'none',
        })
        container.appendChild(this.dom)
        this.bullets = {
            rendered: [],
            flying:   [],
            free:     [],
        }
        this.width  = undefined
        this.height = undefined
        this.updateRect()
        this.tracks = {
            rolling: new Track(this.height),
            top:     new Track(this.height),
            bottom:  new Track(this.height),
        }
        this.df = document.createDocumentFragment()
    }
    /**
     * 渲染一组弹幕
     * @param {Array}  danmakus 弹幕数组
     * @param {Object} style    基础样式
     */
    render(danmakus, style) {
        danmakus.forEach(danmaku => {
            let bullet
            if (this.bullets.free.length) {
                bullet = this.bullets.free.shift()
            } else {
                bullet = new Bullet(this)
                this.df.appendChild(bullet.dom)
            }
            bullet.init(danmaku, style)
            this.bullets.rendered.push(bullet)
        })
        if (this.df.childElementCount)
            this.dom.appendChild(this.df)
        this.updateRect()
        this.bullets.rendered.forEach(bullet => bullet.updateRect())
    }
    /**
     * 发射处于 rendered 状态的弹幕
     * @param {Number} time  当前播放时间, 用于计算弹幕消失时间
     * @param {Number} speed 弹幕速度
     */
    shot(time, speed, now = Date.now()) {
        this.bullets.rendered.forEach(bullet => {
            bullet.shot(time, speed, now)
            this.bullets.flying.push(bullet)
        })
        this.bullets.rendered.splice(0, this.bullets.rendered.length)
    }
    gc(now = Date.now()) {
        while (this.bullets.flying.length && now >= this.bullets.flying[0].finish) {
            let bullet = this.bullets.flying.shift()
            bullet.free()
            this.bullets.free.push(bullet)
        }
    }
    updateRect() {
        let bcr = this.dom.getBoundingClientRect()
        this.height = bcr.height
        this.width = bcr.width
    }
    pause(now = Date.now()) {
        this.bullets.flying.forEach(bullet => bullet.pause(now))
    }
    resume(now = Date.now()) {
        this.bullets.flying.forEach(bullet => bullet.resume(now))
    }
    syncTimestamp(value) {
        for (let key in this.tracks) {
            this.tracks[key].syncTimestamp(value)
        }
        this.bullets.flying.forEach(bullet => {
            bullet.finish += value
            bullet.pauseTime += value
        })
    }
}

export default Stage
