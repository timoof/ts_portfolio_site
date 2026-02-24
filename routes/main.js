const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Home Page (Data Engineering + Overview)
router.get('/', (req, res) => {
    res.render('pages/index', { title: 'Timofey Sadovnikov | Portfolio' });
});

// Music Section
router.get('/music', (req, res) => {
    const musicDir = path.join(__dirname, '../uploads/music');

    // Create directory if it doesn't exist
    if (!fs.existsSync(musicDir)) {
        fs.mkdirSync(musicDir, { recursive: true });
    }

    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.render('pages/music', { title: 'Music Production', tracks: [] });
        }

        // Filter for audio files
        const tracks = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'))
            .map(file => {
                return {
                    filename: file,
                    title: file.replace(/\.[^/.]+$/, "").replace(/-/g, " "), // Simple formatting
                    path: `/uploads/music/${file}`
                };
            });

        res.render('pages/music', { title: 'Music Production', tracks: tracks });
    });
});

// Web Dev Section
router.get('/web-dev', (req, res) => {
    const projectsDir = path.join(__dirname, '../uploads/web-projects');

    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir, { recursive: true });
    }

    fs.readdir(projectsDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error(err);
            return res.render('pages/web-dev', { title: 'Web Development', projects: [] });
        }

        const projects = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        res.render('pages/web-dev', { title: 'Web Development', projects: projects });
    });
});

// Project Viewer
router.get('/view-project/:project', (req, res) => {
    const project = req.params.project;
    const projectPath = path.join(__dirname, '../uploads/web-projects', project);

    // Check if project exists
    if (fs.existsSync(projectPath)) {
        res.render('pages/viewer', { layout: false, project: project });
    } else {
        res.status(404).send('Project not found');
    }
});

module.exports = router;
