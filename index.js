const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const lib = require("./lib/saveToDb");
const compression = require('compression')
const fs = require('fs');

const app = express();

app.use(function(req, res, next) {

  var allowedOrigins = [
    'https://blueprintcap-dev.webflow.io',
    'https://blueprint-cap.webflow.io',
    'https://blueprintcap.com',
    'https://www.blueprintcap.com'
  ];
  var origin = req.headers.origin;

  //console.log(origin)
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static('embed'))
app.use(compression())

app.get('/', async (req, res) => {
  res.send('index')
});

// BLUEPRINT MAP JSON DATA
async function fetchUrl(url) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
    })
    return response
  } catch (error) {
    return { status: "No Server Response" };
  }
}
app.get('/map-json', async (req, res) => {
  const properties = await lib.getData("listing");
  const propHaveImg = properties.filter((property) =>
    property.thumbnailimagebase64 !== ""
  )
  res.send(propHaveImg)
});

app.post('/single-json', async (req, res) => {
  const id = req.body.id
  const properties = await lib.getData("listing");
  const getSinglePropData = properties.find(item => item.id == id)
  const singlePropData = getSinglePropData ? { propData: getSinglePropData } : { propData: "not found" };
  res.send(singlePropData)
});

app.get('/default-json', async (req, res) => {
  const fetchdata = await axios({
    method: 'GET',
    url: "https://connect.blueprintcap.com/mapdata.JSON",
  })
    .then(async function(response) {
      res.send(response.data)
    });
});

app.get('/test', async (req, res) => {
  const fetchdata = await axios({
    method: 'GET',
    url: "https://connect.blueprintcap.com/mapdata.JSON",
  })
    .then(async function(response) {
      let status = []
      const data = response.data
      for (let i = 0; i < data.length; i++) {
        const newStatus = {
          status: data[i].status,
          webstatus: data[i].webstatus
        }
        status.push(newStatus)
      }
      res.send(status)
    });
});

app.get('/no-duplicate-json', async (req, res) => {
  const fetchdata = await axios({
    method: 'GET',
    url: "https://blueprint.kylesmurdon.repl.co/map-json",
  })
    .then(async function(response) {
      const data = response.data
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
      res.send(uniqueLocation)
    });
});

app.get('/big-img', async (req, res) => {
  const id = req.query.id
  let rawdata = fs.readFileSync('./json/base64img.json');
  let bigImg = JSON.parse(rawdata);
  const getImg = bigImg?.base64img?.find(img => img.id === id)
  const base64Img = getImg ? getImg : { "fullimg": "not found" }
  res.send(base64Img)
});

app.get('/featured', async (req, res) => {
  const properties = await lib.getData("listing");
  const featuredPost = properties.slice(0, 5);
  res.send(featuredPost)
});

app.get('/save-json', async (req, res) => {
  const fetchdata = await fetchUrl("https://connect.blueprintcap.com/mapdata.JSON");
  if (fetchdata.status == "No Server Response" || fetchdata.data == "Not Found") {
    res.send("Error Getting Data from Filemaker")
  } else {
    await lib.saveData(fetchdata.data);
    res.send("Success Sync Data")
  }

});

app.post('/form', async (req, res) => {
  let data = JSON.stringify({
    "description": req.body.desc,
    "city": req.body.city,
    "displayName": req.body.name,
    "email": req.body.email,
    "phone": req.body.phone,
    "listingURL": req.body.listing,
    "offerReview": req.body.offer
  });

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://staging-server.datapage.com/api/lead',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      res.send({ "status": "success" });
    })
    .catch((error) => {
      res.send({ "status": "error" });
    });

});

app.listen(3000, () => {
  console.log('server started');
});

export const handler = serverless(app)