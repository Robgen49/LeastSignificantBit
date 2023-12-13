const path = require("path")
const bmp = require("./bmp")
const getSlice = require("./getSlice")
const fs = require('fs')

module.exports = function getSlices(imagePath, count = 2) {

    const data = fs.readFileSync(imagePath)

    const containerMetaSpace = bmp.call(data).locationOfRasterArray

    const colorData = data.slice(containerMetaSpace, data.length)

    const grayPixels = []

    for (let index = 0; index < colorData.length; index += 3) {

        const grayPixel = Math.round((colorData[index] * 0.114) + (colorData[index] * 0.587) + (colorData[index] * 0.299))

        grayPixels.push([grayPixel, grayPixel, grayPixel])
    }

    for (let index = 0; index < count; index++) {
        fs.writeFileSync(`${path.join(path.dirname(imagePath), path.basename(imagePath).split`.`[0] + index.toString())}.bmp`, Buffer.from([...data.slice(0, containerMetaSpace)].concat(getSlice(grayPixels, index)).flat()))
    }
}