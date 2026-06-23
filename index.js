// Core Modules 1 //

const fs = require("node:fs");
const readFileStream = fs.createReadStream("./data.txt", {
  encoding: "utf-8",
  highWaterMark: 10,
});
readFileStream.on("data", (chunk) => {
  console.log(chunk);
});

// ******************************************************//

// Core Modules 2 //

const writeFileStream = fs.createWriteStream("./dest.txt");
readFileStream.on("data", (chunk) => {
  writeFileStream.write(chunk);
  console.log("File copied using stream");
});

// ******************************************************//

// Core Modules 3 //

const { createGzip } = require("node:zlib");
const gzip = createGzip();
readFileStream.pipe(gzip).pipe(fs.createWriteStream("./data.zip"));

// ******************************************************//

// CRUD Operations //

const http = require("node:http");
const path = require("node:path");

let writeOn = (data) => {
  return fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(data), {
    encoding: "utf-8",
  });
};

const server = http.createServer((req, res, next) => {
  const { url, method } = req;
  let users = JSON.parse(fs.readFileSync(path.resolve("./users.json")));
  if (method == "POST" && url == "/POST/user") {
    let parsedData = "";
    req.on("data", (chunk) => {
      parsedData = JSON.parse(chunk);
    });
    req.on("end", () => {
      let exist = users.findIndex((user) => {
        return user.email == parsedData.email;
      });
      if (exist == -1) {
        users.push(parsedData);
        writeOn(users);
        res.end(JSON.stringify({ message: "User added successfully." }));
      } else {
        res.end(JSON.stringify({ message: "Email already exists." }));
      }
    });
  } else if (method == "PATCH" && url.startsWith("/PATCH/user/")) {
    let parsedData = "";
    req.on("data", (chunk) => {
      parsedData = JSON.parse(chunk);
    });
    req.on("end", () => {
      let id = url.split("/")[3];
      let exist = users.findIndex((user) => {
        return user.id == id;
      });
      if (exist == -1) {
        res.end(JSON.stringify({ message: "User ID not found" }));
      } else {
        users[exist].age = parsedData.age;
        writeOn(users);
        res.end(JSON.stringify({ message: "User age updated successfully" }));
      }
    });
  } else if (method == "DELETE" && url.startsWith("/DELETE/user/")) {
    let id = url.split("/")[3];
    let exist = users.findIndex((user) => {
      return user.id == id;
    });
    if (exist == -1) {
      res.end(JSON.stringify({ message: "User ID not found" }));
    } else {
      users.splice(exist, 1);
      writeOn(users);
      res.end(JSON.stringify({ message: "User deleted successfully" }));
    }
  } else if (method == "GET" && url == "/GET/user") {
    res.end(JSON.stringify(users));
  } else if (method == "GET" && url.startsWith("/GET/user/")) {
    let id = url.split("/")[3];
    let exist = users.findIndex((user) => {
      return user.id == id;
    });
    if (exist == -1) {
      res.end(JSON.stringify({ message: "User ID not found" }));
    } else {
      res.end(JSON.stringify(users[exist]));
    }
  } else {
    res.end(JSON.stringify({ message: "404 Url not found" }));
  }
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});


