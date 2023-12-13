module.exports = function insertInLastBits(data, bits, countOfLastBits = 2) {
    let count = 0
    return data.map(byte => {
        byte = byte.toString(2).padStart(8, '0').split``
        for (let index = countOfLastBits; index > 0; index--) {
            byte[8 - index] = bits[count]
            count++
        }
        return parseInt(byte.join``, 2)
    })
}