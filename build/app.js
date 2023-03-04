import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const yargs = __require("yargs");
import { listContact, newContact, removeContact, showContact, updateContact } from "./app/contact.js";
yargs
    .command({
    command: "add",
    describe: "Menambahkan Kontak Baru",
    builder: {
        nama: {
            describe: "Nama lengkap",
            demandOption: true
        },
        noTelp: {
            describe: "Nomor Telepon",
            demandOption: true
        }
    },
    handler(argv) {
        newContact({ name: argv.nama, noTelp: argv.noTelp });
    }
})
    .demandCommand();
yargs.command({
    command: "list",
    describe: "Menampilkan daftar kontak",
    handler() {
        listContact();
    }
});
yargs.command({
    command: "show",
    describe: "Menampilkan detail dari kontak",
    builder: {
        nama: {
            describe: "Nama kontak tersimpan.",
            demandOption: true
        }
    },
    handler(args) {
        showContact(args.nama);
    }
});
yargs.command({
    command: "delete",
    describe: "Menghapus data contact",
    builder: {
        nama: {
            describe: "Nama kontak yang akan dihapus.",
            demandOption: true
        }
    },
    handler(args) {
        removeContact(args.nama);
    }
});
yargs.command({
    command: "update",
    describe: "Mengubah data contact",
    builder: {
        nama: {
            describe: "Nama kontak yang akan diubah.",
            demandOption: true
        },
        namaBaru: {
            describe: "Masukkan nama kontak baru jika nama ingin diubah."
        },
        noTelp: {
            describe: "Masukkan nama noTelp baru jika noTelp ingin diubah."
        }
    },
    handler(args) {
        updateContact(args.nama, args.namaBaru, args.noTelp);
    }
});
yargs.parse();
