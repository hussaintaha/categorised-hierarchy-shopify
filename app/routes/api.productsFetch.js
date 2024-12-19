import { apiVersion, authenticate } from "../shopify.server";
import { shopifyGraphqlAPI } from "./utils";

export const action = async ({ request }) => {
  try {

    const { admin, session } = await authenticate.admin(request);
    console.log("session ==== ", session);

    if (!session) {
      return { error: "No session found" };
    }

    const bodyData = await request.json();
    console.log("bodyData ==== ", bodyData);

    const { categoryName } = bodyData;

    let query;
    if (categoryName == "tags") {
      query = `
        query GetProducts {
          products(first: 150) {
            nodes {
              tags
            }
          }
        }
     `;

      let tagResponse = await shopifyGraphqlAPI(session, apiVersion, query)
      console.log("tagResponse === ", tagResponse);
      const list = tagResponse.data.products.nodes
      const mergedTags = list.map(itme => { return itme.tags }).flat()
      const uniqueTags = [...new Set(mergedTags)];
      // console.log("uniqueTags === ", uniqueTags);
      return uniqueTags;



    } else if (categoryName == "product type") {
      query = `
        query GetProducts {
          products(first: 150) {
            nodes {
             productType
            }
          }
        }
      `;

      let productTypeResponse = await shopifyGraphqlAPI(session, apiVersion, query)
      const list = productTypeResponse.data.products.nodes
      console.log("list ========", list);

      const mergedProductType = list.map(type => { return type.productType }).flat()
      console.log("mergedProductType =======", mergedProductType);

      const uniqueproductType = [...new Set(mergedProductType)];
      console.log("uniqueproductType === ", uniqueproductType);

      const removeEmptyType = uniqueproductType.filter(type => type !== "");
      console.log("removeEmptyType ======= ", removeEmptyType);


      return removeEmptyType
    }

  } catch (error) {
    console.error("Error in productsFetch", error);
    return { error: "An unexpected error occurred", details: error.message };
  }
};