const express = require("express");
const contactscontroller = require("../Controllers/Contacts");
const isAuth = require("../Middlewares/isAuth");
const { body } = require("express-validator");

const router = express.Router();

router.post(
    "/add",
    isAuth,
    [body("mobileno").isMobilePhone().notEmpty(), body("name").notEmpty()],
    contactscontroller.addContact
);

router.get("/get", isAuth, contactscontroller.getContacts);

router.post("/delete", isAuth, contactscontroller.deletecontact);

router.post("/clearchat", isAuth, contactscontroller.clearchat);

router.post(
    "/edit",
    isAuth,
    [body("name").notEmpty()],
    contactscontroller.editcontact
);

module.exports = router;
