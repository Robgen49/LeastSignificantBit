module.exports = function readLastBits(data, countOfLastBits = 2) {
    const bytesOfMessage = []
    let byteOfMessage = []
    let count = 0
    data.forEach(byte => {
        if (count >= 8) {
            bytesOfMessage.push(parseInt(byteOfMessage.join``.slice(0, 8), 2))
            byteOfMessage = byteOfMessage.join``
            byteOfMessage = byteOfMessage.length > 8 ? [byteOfMessage.slice(8, byteOfMessage.length)] : []
            count = byteOfMessage.join``.length
        }
        let str = ""
        for (let index = countOfLastBits; index > 0; index--) {
            str += byte.toString(2).padStart(8, '0')[8 - index]
        }
        byteOfMessage.push(str.padStart(8, '0').slice(-countOfLastBits))
        count += countOfLastBits
    })
    return bytesOfMessage
}