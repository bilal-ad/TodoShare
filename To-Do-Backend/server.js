const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");



const listsRouter = require('./routes/lists');
const todosRouter = require("./routes/todos");
const authRouter = require("./routes/auth");

dotenv.config();        
connectDB();           

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/lists', listsRouter);
app.use("/api/lists", todosRouter);
app.use("/api/auth", authRouter);



const PORT = 5000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});