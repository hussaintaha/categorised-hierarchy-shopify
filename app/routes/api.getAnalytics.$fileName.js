import path from "path";
import fs from "fs/promises";

export const loader = async ({ request, params }) => {
  try {
    console.log("params ===== ", params);

    const { fileName } = params;

    const filePath = path.resolve("public", "data", `${fileName}.json`);

    const fileContent = await fs.readFile(filePath, "utf-8");

    if (fileContent) {
      const data = JSON.parse(fileContent);
      console.log("DATA === ", data);
      return { status: true, data: data }
    }

  } catch (error) {
    console.log("error in getAnalytics api", error);
    return error;
  }
}