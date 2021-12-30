class Track {
    constructor(height) {
        this.height = height
        this.tracks = [{
            top: 0,
            height: height,
            show: 0,
            finish: 0,
            count: 0
        }]
    }
    get(height, appearing, show, hidding, finish, overlap = true) {
        if (height >= this.height)
            return 0
        let mergeIndex = -1, bestIndex = 0
        let needHeight = height
        let result = null
        for (let i = 0; i < this.tracks.length; i++) {
            let track = this.tracks[i]
            if (appearing >= track.show && hidding >= track.finish) {
                if (needHeight === track.height) {
                    if (mergeIndex >= 0) {
                        result = this.tracks[mergeIndex]
                        merge.call(this, mergeIndex, i, height, show, finish)
                    } else {
                        result = track
                        update.call(this, i, height, show, finish)
                    }
                    break
                } else if (needHeight < track.height) {
                    append.call(this, i, track.top + needHeight, track.height - needHeight)
                    if (mergeIndex >= 0) {
                        result = this.tracks[mergeIndex]
                        merge.call(this, mergeIndex, i, height, show, finish)
                    } else {
                        result = track
                        update.call(this, i, needHeight, show, finish)
                    }
                    break
                } else {
                    if (mergeIndex < 0)
                        mergeIndex = i
                    needHeight -= track.height
                }
            } else {
                needHeight = height
                mergeIndex = -1
            }
            if (track.top + height <= this.height && track.show <= this.tracks[bestIndex].show && track.count < this.tracks[bestIndex].count)
                bestIndex = i
        }
        if (! result && overlap) {
            result = this.tracks[bestIndex]
            needHeight = height
            mergeIndex = -1
            for (let i = bestIndex; i < this.tracks.length; i++) {
                let track = this.tracks[i]
                if (track.height === needHeight) {
                    if (mergeIndex >= 0)
                        merge.call(this, mergeIndex, i, height, show, finish)
                    else
                        update.call(this, bestIndex, height, show, finish)
                    break
                } else if (track.height > needHeight) {
                    if (mergeIndex >= 0) {
                        merge.call(this, mergeIndex, i, height, show, finish)
                    } else {
                        append.call(this, bestIndex, track.top + needHeight, track.height - needHeight)
                        update.call(this, bestIndex, height, show, finish)
                    }
                    break
                } else if (mergeIndex < 0) {
                    mergeIndex = i
                }
                needHeight -= track.height
            }
        }
        return result
    }
    clear(newHeight) {
        if (newHeight !== undefined)
            this.height = newHeight
        merge.call(this, 0, this.tracks.length - 1, this.height, 0, 0)
    }
    syncTimestamp(value) {
        this.tracks.forEach(track => {
            track.show += value
            track.finish += value
        })
    }
}

export default Track

function update(index, height, show, finish) {
    this.tracks[index].height = height
    this.tracks[index].show = show
    this.tracks[index].finish = finish
    this.tracks[index].count++
}

function merge(begin, end, height, show, finish) {
    this.tracks.splice(begin + 1, end - begin)
    update.call(this, begin, height, show, finish)
}

function append(after, top, height) {
    this.tracks.splice(after + 1, 0, {
        top: top,
        height: height,
        show: this.tracks[after].show,
        finish: this.tracks[after].finish,
        count: this.tracks[after].count
    })
}
