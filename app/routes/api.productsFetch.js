import { error } from "console";
import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    console.log("session ==== ", session);


    if (!session) {
      return "No session found"
    }



    return true
  } catch (error) {
    console.log("error in productsFetch", error);
    return error
  }
}