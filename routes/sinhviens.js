var express = require('express');
var router = express.Router();
const sinhvienController = require('../controllers/sinhviens');

/* GET List SinhVien. */
router.get('/', sinhvienController.getAll);
/* ADD SinhVien. */
router.post('/', sinhvienController.addSinhVien);
/* UPDATE SinhVien By ID. */
router.put('/:sinhvienId', sinhvienController.updateSinhVienByID);
/* DELETE SinhVien By ID. */
router.delete('/:sinhvienId', sinhvienController.deleteSinhVienByID);
/* GET SinhVien By ID. */
router.get('/:sinhvienId', sinhvienController.getSinhVienByID);

module.exports = router;