const Database = require("@replit/database")
const db = new Database()
const fs = require( 'fs' );

async function saveData(data) {
  let bigImgJson = { base64img: [] }
  for (let i = 0; i < data.length; i++) {
    bigImgJson.base64img.push({ "id": data[i].id, "fullimg": data[i].fullimagebase64 })
    delete data[i].fullimagebase64
  }

  //const newData = await rebuildData(data)
  const saveToDb = await db.set("listing", data);
  const saveToFile = await writeData(bigImgJson);

  if (saveToDb && saveToFile == "success") {
    return "success"
  } else {
    return "failed"
  }
}

async function rebuildData(data) {
  data.reverse();
  let uniqueLocation = [...new Map(data.map(item => [item["geolocation"], item])).values()]
  for (let i = 0; i < uniqueLocation.length; i++) {
    const getSameLocation = data.filter((item) => {
      if (item.id !== uniqueLocation[i].id)
        return item.geolocation == uniqueLocation[i].geolocation
    });
    if (getSameLocation.length != 0 && getSameLocation != undefined) {
      uniqueLocation[i].houses = getSameLocation
    }
  }
  return uniqueLocation.reverse()
}


async function writeData(data) {
  const path = "./json/base64img.json"
  const jsonContent = JSON.stringify(data);
  fs.writeFileSync(path,jsonContent,{encoding:'utf8',flag:'w'})
  return "success"
}

async function getData(key) {
  const dataTest = await db.get(key)
  return dataTest
}

module.exports = { saveData, getData };

