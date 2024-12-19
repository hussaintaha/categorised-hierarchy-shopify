import { json } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";



export const shopifyGraphqlAPI = async (session, apiVersion, query) => {
  try {
    const fetchCategorizedProducts = await fetch(
      `https://${session.shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": session.accessToken,
        },
        body: JSON.stringify({ query }),
      }
    );
    console.log("fetchCategorizedProducts.status", fetchCategorizedProducts.status);
    const response = await fetchCategorizedProducts.json();
    // console.log("response ==== ", response);
    return response

  } catch (error) {
    console.log("error ===== ", error);
    return error
  }
}

export const saveProducts = async (categoryType, categoryName, response) => {
  console.log("categoryType ==== ", categoryType);
  // console.log("categoryName ==== ", categoryName);
  // console.log("response ==== ", response);

  try {
    if (categoryName && categoryType && response) {

      const filePath = path.resolve("public", "data", `${categoryType.split(" ").join("")}.json`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      let existingData = { categoryType, data: [] };

      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
      } catch (err) {
        if (err.code !== "ENOENT") throw err;
      }

      const categoryIndex = existingData.data.findIndex(
        (item) => item.categoryName === categoryName
      );

      if (categoryIndex > -1) {
        existingData.data[categoryIndex].products.push(...response);
      } else {
        existingData.data.push({
          categoryName,
          products: response,
        });
      }

      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf-8");
      return json({ success: true, message: "File updated successfully", filePath });
    }
  } catch (error) {
    console.log("error ==== ", error);
    return error
  }





}