const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

// Auth Middleware
const checkAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'music') {
            const dir = path.join(__dirname, '../uploads/music');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } else if (file.fieldname === 'web-project') {
            const dir = path.join(__dirname, '../uploads/temp');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir); // Temp storage for zip
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Login Page
router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Admin Login', error: null });
});

// Login Handler
router.post('/login', (req, res) => {
    const { password } = req.body;
    // Hardcoded password
    if (password === 'timofey_admin') {
        req.session.isAuthenticated = true;
        res.redirect('/admin');
    } else {
        res.render('pages/login', { title: 'Admin Login', error: 'Invalid Password' });
    }
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Admin Dashboard (Protected)
router.get('/', checkAuth, (req, res) => {
    res.render('pages/admin', { title: 'Admin Portal' });
});

// Upload Music
router.post('/upload/music', checkAuth, upload.single('music'), (req, res) => {
    // In a real app, integrate with SQLite here
    res.redirect('/admin');
});

// Upload Web Project
router.post('/upload/project', checkAuth, upload.single('web-project'), (req, res) => {
    if (req.file) {
        const zipPath = req.file.path;
        const extractPath = path.join(__dirname, '../uploads/web-projects', req.body.projectName);

        try {
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            // Clean up zip file
            fs.unlinkSync(zipPath);
            res.redirect('/admin');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error extracting project');
        }
    } else {
        res.status(400).send('No file uploaded');
    }
});

module.exports = router;
