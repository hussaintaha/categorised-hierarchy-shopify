import { apiVersion, authenticate } from "../shopify.server";
import { saveProducts, shopifyGraphqlAPI } from "./utils";

export const action = async ({ request, params }) => {

  try {
    const { admin, session } = await authenticate.admin(request);

    if (!session) {
      return { error: "No session found" };
    }

    const reqBody = await request.json();
    const { categoryType, categoryName } = reqBody;

    if (categoryType == "tags") {
      const query = `
        query {
          products(first: 250, query: "tag:${categoryName}") {
            edges {
              node {
                id
                title
                description
                createdAt
                updatedAt
                tags
                vendor
                productType
                status
                totalInventory
                options {
                  id
                  name
                  values
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      price
                      inventoryQuantity
                      availableForSale
                    }
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      id
                      altText
                      originalSrc
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `;

      const getProductResponse = await shopifyGraphqlAPI(session, apiVersion, query);
      const tagResponse = getProductResponse.data.products.edges;
      // console.log("tagResponse ==== ", tagResponse);
      if (tagResponse.length > 0) {
        const saveDataInJsonFile = await saveProducts(categoryType, categoryName, tagResponse);
        console.log("saveDataInJsonFile === ", saveDataInJsonFile);

        return { status: true, data: tagResponse }
      } else {
        return { status: false, data: "Products Not Found" }
      }
    }


    else if (categoryType == "product type") {
      const query = `
        query {
          products(first: 150, query: "product_type:${categoryName}") {
            edges {
              node {
                id
                title
                description
                createdAt
                updatedAt
                tags
                vendor
                productType
                status
                totalInventory
                options {
                  id
                  name
                  values
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      price
                      inventoryQuantity
                      availableForSale
                    }
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      id
                      altText
                      originalSrc
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        } 
      `;

      const getProductResponse = await shopifyGraphqlAPI(session, apiVersion, query);
      const typeResponse = getProductResponse.data.products.edges;
      console.log("typeResponse ====== ", typeResponse);

      if (typeResponse.length > 0) {
        const saveDataInJsonFile = await saveProducts(categoryType, categoryName, typeResponse);
        console.log("saveDataInJsonFile === ", saveDataInJsonFile);
        return { status: true, data: typeResponse }
      } else {
        return { status: false, data: "Products Not Found" };
      }
    };




  } catch (error) {
    console.log("error in main Category====== ", error);
    return error
  }

  console.log("body ==== ", await request.json());
  return true

}








