const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const validateContacts = require('../middleware/validateContacts')
const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact
} = require('../controller/cont')

router.use(authMiddleware)

router.get('/', listContacts)

router.get('/:id', getContactById)

router.post('/', validateContacts, addContact)

router.put('/:id', updateContact)

router.patch('/:id/favorite', updateStatusContact)

router.delete('/:id', removeContact)

module.exports = router