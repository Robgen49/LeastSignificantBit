const fs = require('fs')
const path = require('path')

const bmp = require('./utils/bmp')
const insertInLastBits = require('./utils/insertInLastBits')
const readLastBits = require('./utils/readLastBits')
const getSlices = require('./utils/getSlices')

const containerPath = path.join(__dirname, '/images/container.bmp')
const messagePath = path.join(__dirname, '/images/message.bmp')

const filledContainerPath = path.join(__dirname, '/images/filledContainer.bmp')
const imagesPath = path.join(__dirname, '/images')

function LSBHide(countOfBits = 2) {

    const containerData = [...fs.readFileSync(containerPath)]

    const messageData = [...fs.readFileSync(messagePath)]

    const containerMetaSpace = bmp.call(containerData).locationOfRasterArray

    const space = containerData.slice(containerMetaSpace, containerData.length).length //12288000

    const messageInsideContainerSize = (messageData.length * 8) / countOfBits //4504000 //9008000 //24

    const messageInsideContainerSizeLength = messageInsideContainerSize.toString(2).length

    const messageInsideContainerSizeBinary = messageInsideContainerSize.toString(2).padStart(24, '0')

    if (space - messageInsideContainerSizeLength < messageInsideContainerSize || messageInsideContainerSizeLength > 24) {
        throw new Error('not enough space')
    }

    let messageBits = []
    messageData.forEach(byte => {
        messageBits.push(byte.toString(2).padStart(8, '0'))
    })
    messageBits = messageBits.join``

    const containerDataWithWrittenNumber = containerData.slice(containerMetaSpace, containerMetaSpace + 24).map((byte, i) => {
        byte = byte.toString(2).padStart(8, '0').split``
        byte[7] = messageInsideContainerSizeBinary[i]
        return parseInt(byte.join``, 2)
    })

    const containerDataWithWrittenBytes = insertInLastBits(containerData.slice(containerMetaSpace + 24, messageInsideContainerSize), messageBits, countOfBits)

    const filledContainerData = containerData.slice(0, containerMetaSpace).concat(containerDataWithWrittenNumber).concat(containerDataWithWrittenBytes).concat(containerData.slice(messageInsideContainerSize, containerData.length))

    fs.writeFileSync(filledContainerPath, Buffer.from(filledContainerData))

    getSlices(containerPath, countOfBits + 1)

    getSlices(filledContainerPath, countOfBits + 1)
}

function LSBRead(countOfBits = 2) {

    const filledContainerData = [...fs.readFileSync(filledContainerPath)]

    const filledContainerMetaSpace = bmp.call(filledContainerData).locationOfRasterArray

    let numberOfMessageBits = []

    filledContainerData.slice(filledContainerMetaSpace, filledContainerMetaSpace + 24).forEach(byte => {
        numberOfMessageBits.push(byte.toString(2).padStart(8, '0')[7])
    })
    numberOfMessageBits = parseInt(numberOfMessageBits.join``, 2)

    const bytesOfMessage = readLastBits(filledContainerData.slice(filledContainerMetaSpace + 24, numberOfMessageBits), countOfBits)

    fs.writeFileSync(imagesPath + '/decodedMessage.bmp', Buffer.from(bytesOfMessage))

}

LSBHide(4)
LSBRead(4)