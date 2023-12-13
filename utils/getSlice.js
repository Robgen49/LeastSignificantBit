function getBit(byte, number) {
    return ((byte >> number) & 1) * 255
}

module.exports = function getSlice(pixels, number) {
    {
        return pixels.map(p => { const cut = getBit(p[0], number); return [cut, cut, cut] })
    }
}