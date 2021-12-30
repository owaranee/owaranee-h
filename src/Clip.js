class Clip {
    constructor(overtime = 100) {
        this.danmakus = []        // 弹幕列表
        this.pointer  = 0         // 下一条弹幕的位置
        this.overtime = overtime  // 两次获取弹幕的最长时间间隔
    }
    /**
     * 装载一条弹幕
     * @param {Object} danmaku 弹幕对象
     */
    load(danmaku) {
        if ((!danmaku.text && !danmaku.html) || typeof danmaku.time !== 'number') {
            return
        }
        if (this.danmakus.length === 0) {
            this.danmakus.push(danmaku)
        } else {
            let low = 0, high = this.danmakus.length - 1
            while (low < high) {
                let mid = low + ((high - low) >> 1)
                if (this.danmakus[mid].time <= danmaku.time) {
                    low = mid + 1
                } else {
                    high = mid - 1
                }
            }
            if (danmaku.time >= this.danmakus[low].time) {
                this.danmakus.splice(low + 1, 0, danmaku)
            } else {
                this.danmakus.splice(low, 0, danmaku)
            }
            if (this.pointer !== 0 && low <= this.pointer) {
                // 新弹幕插入到了 [0, pointer] 的位置上
                this.pointer++  // 向后移动 pointer
            }
        }
    }
    /**
     * 根据时间调整下一条弹幕的位置
     * @param {Number} time 
     */
    movePointerTo(time) {
        let low = 0, high = this.danmakus.length - 1
        while (low < high) {
            let mid = low + ((high - low) >> 1)
            if (this.danmakus[mid].time < time) {
                low = mid + 1
            } else {
                high = mid - 1
            }
        }
        this.pointer = low
        if (this.danmakus[low].time < time) {
            this.pointer++
        }
    }
    /**
     * 获取从 pointer 开始到指定时间之间的弹幕, 同时更新 pointer 的位置
     * @param {Number} time 
     */
    get(time) {
        let danmakus = []
        while (this.pointer < this.danmakus.length && this.danmakus[this.pointer].time <= time) {
            if (this.danmakus[this.pointer].time >= time - this.overtime) {
                danmakus.push(this.danmakus[this.pointer])
            }
            this.pointer++
        }
        return danmakus
    }
}

export default Clip
