import readeline from "node:readline"

// initialize readline input output
export const rl = readeline.createInterface({
    input: process.stdin,
    output: process.stdout
})

export const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer)
        })
    })
}
