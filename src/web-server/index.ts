import { Config } from "./config";
import { createServer } from "./server";

const main = async () => {
    const { port } = Config;
    const app = await createServer();

    app.listen({
        port
    }, () => {
        console.log(`listening on port ${port}`);
    });
}

main();