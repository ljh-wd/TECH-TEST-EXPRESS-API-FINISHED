import express, { Request, Response, NextFunction } from "express";
import { readFile } from "fs/promises";
import { join } from "path";

const app = express();
const port = 3000;
const filePath = join(__dirname, "data.json");

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Internal Server Error: ${err.message}`);
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const readJSONFile = async (filePath: string): Promise<object> => {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
};

app.get("/", async (req: Request, res: Response) => {
  try {
    const jsonData = await readJSONFile(filePath);
    res.json(jsonData);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
