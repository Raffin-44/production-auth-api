import "dotenv/config"
import app from "./app"

app.listen(5001, () => {
    console.log("this server run on port 5001");
});