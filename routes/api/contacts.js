const express = require('express');
const { listContacts, getById, addContact, removeContact, updateContact } = require('../../contactsController');
const router = express.Router();

router.get('/', async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get('/:id', async (req, res) => {
  const contact = await getById(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name - field" });
  }
  const newContact = await addContact({ name, email, phone });
  res.status(201).json(newContact);
});

router.delete('/:id', async (req, res) => {
  const deleted = await removeContact(req.params.id);
  if (deleted) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put('/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const updatedContact = await updateContact(req.params.id, req.body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;