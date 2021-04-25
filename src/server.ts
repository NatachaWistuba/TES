import express from "express";
import { mongoose } from "./config/db";

const app = express();
const db = mongoose;

console.clear();

app.listen(3000, () => {
    console.log("O servidor está rodando...");
})