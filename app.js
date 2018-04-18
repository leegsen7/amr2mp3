const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const fs = require('fs')
const request = require('request')

const app = express()
const port = 4000
const host = 'http://10.0.0.63'
const amrIdReg = /\/(\d+).amr$/

app.use(express.static(__dirname + '/'))

function getPathFn(id, type = 'amr') {
    if (type === 'amr') {
        return `static/amr/${id}.amr`
    }
    return `static/mp3/${id}.mp3`
}
// 判断此MP3文件是否存在
function isExistMp3Fn(id) {
    return fs.existsSync(__dirname + '/' + getPathFn(id, 'mp3'))
}
function getMp3UrlFn(id) {
    return `${host}:${port}/${getPathFn(id, 'mp3')}`
}
// 下载amr
function downloadAmrFn(url, id) {
    return new Promise((resolve,reject) => {
        let stream = fs.createWriteStream(__dirname + '/' + getPathFn(id))
        request(url).pipe(stream).on('close',() => {
            resolve()
        })
    })
}
// 把amr转换成MP3
function trsanMp3Fn(id) {
    return new Promise((resolve,reject) => {
        ffmpeg(getPathFn(id)).on('end', () => {
            resolve()
        }).on('error',err => {
            reject(err)
        }).save(getPathFn(id, 'mp3'))
    })
}

app.get('/amr2mp3',(req,res) => {
    let amrUrl = req.query.url
    let matchRes = amrUrl.match(amrIdReg)
    let amrId = matchRes ? matchRes[1] : null
    if (amrId) {
        let isExist = isExistMp3Fn(amrId)
        // 判断是否是转换过的文件
        if (isExist) {
            res.send({
                status: 1,
                url: getMp3UrlFn(amrId),
            })
        }
        else {
            downloadAmrFn(amrUrl,amrId).then(() => {
                return trsanMp3Fn(amrId)
            }).then(() => {
                res.send({
                    status: 1,
                    url: getMp3UrlFn(amrId),
                })
            }).catch(err => {
                res.send({
                    status: 3,
                    err_msg: '转换出错了',
                    err,
                })
            })
        }
    }
    else {
        res.send({
            status: 2,
            err_msg: 'url有误',
        })
    }
})

app.listen(port, () => {
    console.log(`app is running on ${port}`)
})