import { typifyTheError } from "./errors";

async function handleRequest(reqPromise) {
  try {
    const res = await reqPromise;
    return res.data;
  } catch (error) {
    throw typifyTheError(error);
  }
}

export { handleRequest };
