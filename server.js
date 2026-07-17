
import express from "express"
import dotenv from "dotenv"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

dotenv.config();

const app = express();
app.use(express.json()); 


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
})

//Upload the pdf & extract text
const upload = async() => {

    const pdfPath ="./knowledge.pdf"
    const buffer =fs.readFileSync(pdfPath)  //converts pdf data into raw binary data
    const pdfResult = new PDFParse({data:buffer}) //extracts the raw data from pdf
    const result = await pdfResult.getText() //converts the raw binary data into plain text
    const text = result.text;

    // converting data into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:500,
        chunkOverlap:100
    }) 
    const docs = await splitter.createDocuments([text])


    console.log(docs)
}
upload();


app.post("/ai", async(req, res) => {

    const { input }  = req.body;
    const response = await llm.invoke(input);
    return res.status(200).json({"AI MSG => ": response.content })
})


app.listen( process.env.PORT, () => {
    console.log("Server Started")
})