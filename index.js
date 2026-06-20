// Core Modules 1 //

const fs = require("node:fs")
const readFileStream = fs.createReadStream("./data.txt", { encoding: "utf-8", highWaterMark: 10 })
readFileStream.on("data", (chunk) => {
    console.log(chunk);
})

// ******************************************************//




