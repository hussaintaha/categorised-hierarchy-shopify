import { json } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("body ======== ", body);

    const { selectedOption, responseData } = body;
    if (responseData.status === true) {
      const filePath = path.resolve("public", "data", `${selectedOption.split(" ").join("")}.json`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const jsonObject = {
        categoryName: selectedOption,
        data: responseData
      }

      await fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), "utf-8");
      return json({ success: true, message: "File created successfully", filePath });
    }

    return true
  } catch (error) {
    console.log("error in productSave ==== ", error);
    return error
  }
}