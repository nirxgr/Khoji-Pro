import app from "./app.js";
import connectDB from "./config/mongodb.js";




const port = process.env.PORT || 3000
connectDB();



//Starting the server in a port
app.listen(port, () => {
    console.log(`Server started at PORT: ${port}`);
});



