const express = require('express');
const router = express.Router();
const offenderController = require('../controllers/offenderController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);
router.post('/', requireRole(['admin','secretary','clerk']), offenderController.createOffender);
router.get('/', requireRole(['admin','secretary','clerk','captain']), offenderController.listOffenders);
router.get('/:id', offenderController.getOffenderById);

module.exports = router;
