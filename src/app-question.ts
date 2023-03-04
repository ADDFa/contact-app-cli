import { newContact } from "./app/contact.js"
import { question, rl } from "./app/questions.js"

const name = await question("Masukkan Nama : ")
const noTelp = await question("Masukkan Nomor Telepon : ")

newContact({ name, noTelp })

rl.close()
