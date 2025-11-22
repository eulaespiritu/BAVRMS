const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware); // all violation routes require auth
router.post('/', requireRole(['admin','secretary','clerk','captain']), violationController.createViolation);
router.get('/', requireRole(['admin','secretary','clerk','captain']), violationController.getViolations);
// ... PUT /:id , DELETE /:id etc.

module.exports = router;
