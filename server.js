const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout'); // default layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads directly

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');
app.use(session({
    secret: 'secret_key_change_this', // Simple secret for local dev
    resave: false,
    saveUninitialized: true
}));

// Routes
const mainRoutes = require('./routes/main');
const adminRoutes = require('./routes/admin');

app.use('/', mainRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
