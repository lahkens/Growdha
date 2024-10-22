import express from "express";
import multer from "multer";
import { parseKPI } from "../data/dataParsers/csvToJsonParserKPI.js";
import { parseProducts } from "../data/dataParsers/csvToJsonParserProducts.js";
import { parseTransactions } from "../data/dataParsers/csvToJsonParserTransactions.js";
import KPI from "../models/KPI.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

const router = express.Router();

// Setup multer for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([
    { name: "kpiFile", maxCount: 1 },
    { name: "productFile", maxCount: 1 },
    { name: "transactionFile", maxCount: 1 },
    { name: "dailyDataFile", maxCount: 1 },
    { name: "monthlyDataFile", maxCount: 1 },
  ]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log("Received files:", req.files); // Log the received files

      const { kpiFile, productFile, transactionFile, dailyDataFile, monthlyDataFile } = req.files;

      // Check that all files are uploaded
      if (!kpiFile || !productFile || !transactionFile || !dailyDataFile || !monthlyDataFile) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send("Please upload all required files.");
      }

      // Get the buffer data from the uploaded files
      const kpiBuffer = kpiFile[0].buffer;
      const productBuffer = productFile[0].buffer;
      const transactionBuffer = transactionFile[0].buffer;
      const dailyDataBuffer = dailyDataFile[0].buffer;
      const monthlyDataBuffer = monthlyDataFile[0].buffer;

      // Log the buffers to ensure they're being received correctly
      console.log("Buffer sizes:", {
        kpiBuffer: kpiBuffer.length,
        productBuffer: productBuffer.length,
        transactionBuffer: transactionBuffer.length,
        dailyDataBuffer: dailyDataBuffer.length,
        monthlyDataBuffer: monthlyDataBuffer.length,
      });

      // Convert buffer to string and process it
      const kpiData = await parseKPI(kpiBuffer.toString('utf-8'), dailyDataBuffer.toString('utf-8'), monthlyDataBuffer.toString('utf-8'));
      const productData = await parseProducts(productBuffer.toString('utf-8'));
      const transactionData = await parseTransactions(transactionBuffer.toString('utf-8'));
    //   console.log(transactionData);
      

      // Validate data structure before inserting
      if (!kpiData || !productData || !transactionData) {
        throw new Error("Data validation failed.");
      }

      // Insert data into MongoDB
      await mongoose.connection.db.dropDatabase();
      await KPI.insertMany(kpiData, { session });
      await Product.insertMany(productData, { session });
      await Transaction.insertMany(transactionData, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      res.status(200).json({ message: "Data uploaded and saved successfully!" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error uploading data:", error.message);
  console.error("Stack trace:", error.stack);
  
  res.status(500).json({ error: "Error processing and saving the data.", details: error.message });
    }
  }
);

export default router;
