import fs from "node:fs"
import chalk from "chalk"
import validator from "validator"

const dirPath = "./data"
const filePath = `${dirPath}/contacts.json`

interface contactsType {
    name: string
    noTelp: string
    index?: number
}

type errorValidationContact = {
    name: string
    error: string
}

const validation = (
    request: contactsType,
    contacts: contactsType[]
): errorValidationContact[] => {
    const validationError: errorValidationContact[] = []

    // check duplicate
    const duplicate = contacts.find((e) => e.name === request.name)
    if (duplicate) {
        validationError.push({
            name: "duplicate",
            error: `Kontak dengan nama ${request.name} sudah terdaftar.`
        })
    }

    // check noTelp
    if (!validator.default.isMobilePhone(`${request.noTelp}`, "id-ID")) {
        validationError.push({
            name: "isMobilePhone",
            error: "Nomor telepon tidak valid."
        })
    }

    return validationError
}

const displayValidationFails = (errors: errorValidationContact[]): void => {
    errors.map((error) => {
        console.log(chalk`{bgRed Failed} ${error.error}`)
    })
}

const runCreatingDirectory = (): void => {
    // buat folder data dan file contacts.json
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath) /* make direktory data */

        console.log(chalk`{bgBlue.white Info} Creating New Directory Data`)
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf-8") /* make file contacts.json */

        console.log(chalk`{bgBlue.white Info} Creating New File contacts.json`)
    }
}

runCreatingDirectory()

const loadContact = (handler: (contacts: contactsType[]) => void) => {
    // read file and add contact to file
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err

        const dataJSON = JSON.parse(data)
        handler(dataJSON)
    })
}

const writeContact = (contacts: contactsType[], messageOnSuccess: string) => {
    fs.writeFile(filePath, JSON.stringify(contacts), (err) => {
        if (err) throw err
        console.log(chalk`{bgBlue Info} ${messageOnSuccess}.`)
    })
}

// menambahkan contact baru
export const newContact = async (contact: contactsType): Promise<void> => {
    loadContact((contacts) => {
        // validasi data contact
        const errors = validation(contact, contacts)
        if (errors.length > 0) return displayValidationFails(errors)

        // save contact
        contacts.push(contact)
        writeContact(contacts, "Berhasil menambahkan kontak baru")
    })
}

// menampilkan daftar contact
export const listContact = () => {
    loadContact((contacts) => {
        console.log("\nDaftar Kontak Saya :")

        contacts.forEach((contact, index) => {
            console.log(`${++index}. ${contact.name} \t-> ${contact.noTelp}`)
        })
    })
}

// mencari kontak berdasarkan nama
const findByName = (
    contacts: contactsType[],
    name: string
): contactsType | undefined => {
    const contact = contacts.find((contact, i) => {
        contact.index = i
        return contact.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    }) as contactsType

    if (!contact) {
        console.log(
            chalk`{bgYellow Warning} Kontak dengan nama ${name} tidak terdaftar.`
        )

        return
    }

    return contact
}

// menampilkan detail contact berdasarkan nama
export const showContact = (name: string) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name)
        if (!contact) return

        console.log("\nDetail Kontak :")
        console.log(
            chalk`{blue nama:} ${contact.name} {blue nomor telepon:} ${contact.noTelp}`
        )
    })
}

// menghapus contact berdasarkan nama
export const removeContact = (name: string) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name)
        if (!contact?.index) return

        // remove contact from array and save
        contacts.splice(contact.index, 1)
        writeContact(contacts, `Berhasil menghapus contact ${name}`)
    })
}

export const updateContact = (
    name: string,
    namaBaru: string,
    noTelp: string
) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name)
        if (contact?.index === undefined) return

        const updateProperties = (
            property: "name" | "noTelp",
            value: string
        ) => {
            if (!value || contact.index === undefined) return

            contacts[contact.index][property] = value
        }

        // update data contact dan simpan
        updateProperties("name", namaBaru)
        updateProperties("noTelp", noTelp)

        writeContact(contacts, `Berhasil mengubah kontak ${name}`)
    })
}
