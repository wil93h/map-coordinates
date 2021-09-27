import axios from "axios";
import express, {raw} from "express";
import Path from "path";
import Fs from "fs";
import * as Console from "console";

const api_key = "fXQ3MJnmURlZcZa4zaH8oPvOzTWobUop2T1HLRgt";
const __dirname = Path.resolve(Path.dirname(""));

var app = express();
app.use(express.static(__dirname + "/pages"));

app.get("/", function (req, res) {
  res.sendFile(Path.join(__dirname + "/pages/index.html"));
});

app.get("/:lon&:lat", async (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;
  try{
    await saveImage(lon, lat);
    res.send({lat, lon});
  }catch (error){
    res.status(500);
  }
});

const saveImage = async (longitude, latitude) => {
  try{
    const url = `https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&date=2014-02-01&api_key=fXQ3MJnmURlZcZa4zaH8oPvOzTWobUop2T1HLRgt`;
    const path = Path.resolve(__dirname, "pages", "map.png");
    const writer = Fs.createWriteStream(path);

    const response = await axios({
      url,
      method: "GET",
      timeout: 1000 * 15,
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }catch (error){
    console.log(error);
  }
};

app.listen(3000);
