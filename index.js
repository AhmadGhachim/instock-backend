import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Welcome to the In-Stock API Backend!");
});


app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});



