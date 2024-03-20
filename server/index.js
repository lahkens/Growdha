import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js"
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js"
import Product from "./models/Product.js";
import KPI from "./models/KPI.js";
import Transaction from "./models/Transaction.js"
import {kpis, products, transactions} from "./data/data.js";


// CONFIGURATIONS
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cors());


//middleware
const corsOptions = {
    origin: "https://growdha-website.onrender.com/",
}
app.use(cors(corsOptions));

//ROUTES
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes)
app.use("/transaction", transactionRoutes)


// MONGOOSE SETUP
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
      
    //Add Only Once
    // await mongoose.connection.db.dropDatabase();
    // KPI.insertMany(kpis);
    // Product.insertMany(products);
    // Transaction.insertMany(transactions);

  })
  .catch((error) => console.log(`${error} did not connect`))

  //Backend route
app.get("/", (req, res) => {
    res.status(201).json({message: "Connected to Backend!"});
});

