// Core Modules 1 //

const fs = require("node:fs")
const readFileStream = fs.createReadStream("./data.txt", { encoding: "utf-8", highWaterMark: 10 })
readFileStream.on("data", (chunk) => {
    console.log(chunk);
})

// ******************************************************//

// Core Modules 2 //

const writeFileStream = fs.createWriteStream("./dest.txt")
readFileStream.on("data", (chunk) => {
    writeFileStream.write(chunk)    
    console.log("File copied using stream");
})

// ******************************************************//

// Core Modules 3 //

const { createGzip } = require("node:zlib")
const gzip = createGzip()
readFileStream.pipe(gzip).pipe(fs.createWriteStream("./data.zip"))

// ******************************************************//



