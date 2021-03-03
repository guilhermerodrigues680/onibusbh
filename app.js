import { getLinhas } from "./service.js";

(async () => {
    console.log(getLinhas)
    const a = await getLinhas()
    console.log(a)
})();
