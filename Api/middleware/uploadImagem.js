const multer = require('multer');
const path = require('path');

const tiposPermitidos = ['image/jpeg', 'image/png'];
const extensoesPermitidas = ['.jpeg', '.jpg', '.png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
    },
});

// aceita apenas imagens .jpeg (.jpg) e .png
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (tiposPermitidos.includes(file.mimetype) && extensoesPermitidas.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagem inválido. Envie apenas arquivos .jpeg ou .png'));
    }
}

const uploadImagem = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = uploadImagem;
