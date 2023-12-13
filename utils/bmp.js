function getValue(data, offset, size) {
    let result = ""
    for (let i = offset + size - 1; i >= offset; i--) {
        result += (data[i].toString(16) + '')
    }
    return +("0x" + result)
}

module.exports = function bmp() {
    return {
        title: (getValue(this, 0, 2)).toString(16),
        size: getValue(this, 2, 4),
        reserveField1: getValue(this, 6, 2),
        reserveField2: getValue(this, 8, 2),
        locationOfRasterArray: getValue(this, 10, 4),
        sizeOfRasterArrayInformationHeader: getValue(this, 14, 4),
        imageWidth: getValue(this, 18, 4),
        imageHeight: getValue(this, 22, 4),
        numberOfColorPlanes: getValue(this, 26, 2), //Число цветовых плоскостей 
        bitPerPixel: getValue(this, 28, 2),
        typeOfCompression: getValue(this, 30, 4),
        rasterArrayLength: getValue(this, 34, 4),
        horizontalResolution: getValue(this, 38, 4),
        verticalResolution: getValue(this, 42, 4),
        NumberOfColorsUsed: getValue(this, 46, 4),
        NumberOfMainColors: getValue(this, 50, 4)
    }
}