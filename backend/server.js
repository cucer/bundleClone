const express = require("express");
const request = require("request");
const fetch = require("node-fetch");
const getSizes = require("package-size");
const app = express();
const port = 5000;

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function getSuggestions(pack) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = "https://api.npms.io/v2/search/suggestions?q=" + pack;
      await fetch(url)
        .then(handleErrors)
        .then((res) => res.text())
        .then((result) => {
          if (result === null) throw Error("Could not find any suggestions!");
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function getVersions(pack) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = "https://registry.npmjs.org/" + pack;
      await fetch(url)
        .then(handleErrors)
        .then((res) => res.text())
        .then((result) => {
          if (result === null) throw Error("Could not find any versions!");
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function getPackageSizes(pack) {
  return new Promise(async (resolve, reject) => {
    try {
      getSizes(pack).then((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

app.get("/packageSearch/:pack", async (req, res) => {
  const pack = req.params.pack;
  const data = await getSuggestions(pack);
  res.send(data);
});

app.get("/packageVersions/:pack", async (req, res) => {
  const pack = req.params.pack;
  const data = await getVersions(pack);
  res.send(data);
});

app.get("/packageSizes/:pack", async (req, res) => {
  const pack = req.params.pack;
  const data = await getPackageSizes(pack);
  res.send(data);
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
