import readeline from "node:readline";
export const rl = readeline.createInterface({
    input: process.stdin,
    output: process.stdout
});
export const question = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};
