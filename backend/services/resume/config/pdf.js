
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

const extractText = async (filePath) => {
    const buffer = await fs.readFile(filePath);

    const pdf = new PDFParse({
        data: buffer,
    });

    try {
        const result = await pdf.getText();
        return result.text || "";
    } finally {
        if (typeof pdf.destroy === "function") {
            await pdf.destroy();
        }
    }
};

export default extractText;



// pdf ---> pdf storge ---> text extract ---> llm  ---> agent ---> prompt ---> data --> save to mongo db --> resume data (score missing skills recommendations etc.)