const service = require('../service')
const Joi = require('joi')

const contactValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().optional()
})

async function listContacts(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const contacts = await service.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getContactById(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const contact = await service.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addContact(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, phone, favorite = false } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Missing required field" });
  }
  try {
    const newContact = await service.createContact({ name, email, phone, favorite, owner: req.user._id, });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function removeContact(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

    const { id } = req.params
  try {
    const contact = await service.removeContact(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateContact(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;
  const fields = req.body;

  try {
    const updatedContact = await service.updateContact(id, fields);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateStatusContact(req, res) {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await service.updateContact(id, { favorite }, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
    updateStatusContact,
}