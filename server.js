
import express from "express"
import dotenv from "dotenv"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"

dotenv.config();

const app = express();
app.use(express.json()); 


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
})

app.post("/ai", async(req, res) => {

    const { input }  = req.body;
    const response = await llm.invoke(input);
    return res.status(200).json({"AI MSG => ": response.content })
})


app.listen( process.env.PORT, () => {
    console.log("Server Started")
})