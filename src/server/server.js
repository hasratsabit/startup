import "source-map-support/register";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
const router = express.Router();

const app = express();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/jobsearch");
app.set("view engine", "ejs")
app.use(express.static("dist"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../../dist/index.html"))
})
console.log("works");
const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
})
