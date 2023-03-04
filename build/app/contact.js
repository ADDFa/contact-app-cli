import fs from "node:fs";
import chalk from "chalk";
import validator from "validator";
const dirPath = "./data";
const filePath = `${dirPath}/contacts.json`;
const validation = (request, contacts) => {
    const validationError = [];
    const duplicate = contacts.find((e) => e.name === request.name);
    if (duplicate) {
        validationError.push({
            name: "duplicate",
            error: `Kontak dengan nama ${request.name} sudah terdaftar.`
        });
    }
    if (!validator.default.isMobilePhone(`${request.noTelp}`, "id-ID")) {
        validationError.push({
            name: "isMobilePhone",
            error: "Nomor telepon tidak valid."
        });
    }
    return validationError;
};
const displayValidationFails = (errors) => {
    errors.map((error) => {
        console.log(chalk `{bgRed Failed} ${error.error}`);
    });
};
const runCreatingDirectory = () => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log(chalk `{bgBlue.white Info} Creating New Directory Data`);
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf-8");
        console.log(chalk `{bgBlue.white Info} Creating New File contacts.json`);
    }
};
runCreatingDirectory();
const loadContact = (handler) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err)
            throw err;
        const dataJSON = JSON.parse(data);
        handler(dataJSON);
    });
};
const writeContact = (contacts, messageOnSuccess) => {
    fs.writeFile(filePath, JSON.stringify(contacts), (err) => {
        if (err)
            throw err;
        console.log(chalk `{bgBlue Info} ${messageOnSuccess}.`);
    });
};
export const newContact = async (contact) => {
    loadContact((contacts) => {
        const errors = validation(contact, contacts);
        if (errors.length > 0)
            return displayValidationFails(errors);
        contacts.push(contact);
        writeContact(contacts, "Berhasil menambahkan kontak baru");
    });
};
export const listContact = () => {
    loadContact((contacts) => {
        console.log("\nDaftar Kontak Saya :");
        contacts.forEach((contact, index) => {
            console.log(`${++index}. ${contact.name} \t-> ${contact.noTelp}`);
        });
    });
};
const findByName = (contacts, name) => {
    const contact = contacts.find((contact, i) => {
        contact.index = i;
        return contact.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
    if (!contact) {
        console.log(chalk `{bgYellow Warning} Kontak dengan nama ${name} tidak terdaftar.`);
        return;
    }
    return contact;
};
export const showContact = (name) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name);
        if (!contact)
            return;
        console.log("\nDetail Kontak :");
        console.log(chalk `{blue nama:} ${contact.name} {blue nomor telepon:} ${contact.noTelp}`);
    });
};
export const removeContact = (name) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name);
        if (!(contact === null || contact === void 0 ? void 0 : contact.index))
            return;
        contacts.splice(contact.index, 1);
        writeContact(contacts, `Berhasil menghapus contact ${name}`);
    });
};
export const updateContact = (name, namaBaru, noTelp) => {
    loadContact((contacts) => {
        const contact = findByName(contacts, name);
        if ((contact === null || contact === void 0 ? void 0 : contact.index) === undefined)
            return;
        const updateProperties = (property, value) => {
            if (!value || contact.index === undefined)
                return;
            contacts[contact.index][property] = value;
        };
        updateProperties("name", namaBaru);
        updateProperties("noTelp", noTelp);
        writeContact(contacts, `Berhasil mengubah kontak ${name}`);
    });
};
