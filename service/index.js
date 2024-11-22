const Contact = require('./schema/contact');

const getAllContacts = async (_id) => {
    return Contact.find({ owner: _id }).populate('owner', 'email subscription')
}

const getContactById = (id) => {
    return Contact.findOne({ id })
}

const createContact = ({ name, email, phone, favorite, owner }) => {
    return Contact.create({ name, email, phone, favorite, owner })
}

const updateContact = (id, fields) => {
    return Contact.findByIdAndUpdate(id, fields, { new: true })
}

const removeContact = (id) => {
    return Contact.findByIdAndDelete(id)
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    removeContact,
}