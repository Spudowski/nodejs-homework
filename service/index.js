const Contact = require('./schema/contact');

const getAllContacts = async () => {
    return Contact.find()
}

const getContactById = (id) => {
    return Contact.findOne({ _id: id })
}

const createContact = ({ name, email, phone }) => {
    return Contact.create({ name, email, phone })
}

const updateContact = (id, fields) => {
    return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
    return Contact.findByIdAndDelete({ _id: id })
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    removeContact,
}