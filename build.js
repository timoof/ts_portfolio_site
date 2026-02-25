/**
 * Build Script — Renders EJS templates into static HTML files
 * Run: node build.js
 * Output goes to ./dist/ which is what gets uploaded to FTP
 */
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const VIEWS = path.join(__dirname, 'views');

// Clean and recreate dist
if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Read layout template
const layoutSrc = fs.readFileSync(path.join(VIEWS, 'layout.ejs'), 'utf-8');

// Read partials
const headerSrc = fs.readFileSync(path.join(VIEWS, 'partials', 'header.ejs'), 'utf-8');
const footerSrc = fs.readFileSync(path.join(VIEWS, 'partials', 'footer.ejs'), 'utf-8');

/**
 * Render a page: compile its EJS, inject into layout, write to dist
 */
function renderPage(pageName, outputName, locals = {}) {
    const pageSrc = fs.readFileSync(path.join(VIEWS, 'pages', pageName), 'utf-8');

    // Render the page body
    const body = ejs.render(pageSrc, locals, {
        filename: path.join(VIEWS, 'pages', pageName)
    });

    // Render header and footer partials
    const headerHtml = ejs.render(headerSrc, locals, {
        filename: path.join(VIEWS, 'partials', 'header.ejs')
    });
    const footerHtml = ejs.render(footerSrc, locals, {
        filename: path.join(VIEWS, 'partials', 'footer.ejs')
    });

    // Build the full layout manually (replace EJS layout tags)
    let layoutHtml = layoutSrc;

    // Replace include calls with rendered partials
    layoutHtml = layoutHtml.replace(/<%- include\('partials\/header'\) %>/, headerHtml);
    layoutHtml = layoutHtml.replace(/<%- include\('partials\/footer'\) %>/, footerHtml);

    // Replace body placeholder
    layoutHtml = layoutHtml.replace(/<%- body %>/, body);

    // Replace title
    layoutHtml = layoutHtml.replace(/<%= title %>/, locals.title || 'Timofey Sadovnikov');

    // Write output
    const outputPath = path.join(DIST, outputName);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, layoutHtml);
    console.log(`  ✓ ${outputName}`);
}

console.log('Building static site...\n');

// --- Render pages ---
renderPage('index.ejs', 'index.html', {
    title: 'Timofey Sadovnikov | Portfolio'
});

renderPage('music.ejs', 'music.html', {
    title: 'Music Production',
    tracks: [] // Static build = empty, music managed via admin
});

renderPage('web-dev.ejs', 'web-dev.html', {
    title: 'Web Development',
    projects: [] // Static build = empty, projects managed via admin
});

// --- Copy static assets ---
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy CSS and JS
copyDir(path.join(__dirname, 'public'), DIST);

console.log('\n  ✓ Copied /css and /js assets');
console.log('\nBuild complete → ./dist/\n');
