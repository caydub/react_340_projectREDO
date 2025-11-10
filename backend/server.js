// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests

// Valid ports = 1024 < PORT < 65535
const PORT = 59895;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/Albums', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the genres
        const viewAlbums = `SELECT albumID, albumName, albumPrice, amountInStock, \
            artistID, genreID FROM Albums;`;
        const genreDropDown = 'SELECT genreID FROM Genres;';
        const [albums] = await db.query(viewAlbums);
        const [genres] = await db.query(genreDropDown);

        res.status(200).json({ albums, genres });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/Artists', async (req, res) => {
    try {
        // Create and execute our queries
        const viewArtists = 'SELECT artistID, description FROM Artists;';
        const [artists] = await db.query(viewArtists);

        res.status(200).json({ artists });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/Genres', async (req, res) => {
    try {
        // Create and execute our queries
        const viewGenres = 'SELECT genreID, description FROM Genres;';
        const [genres] = await db.query(viewGenres);
        res.status(200).json({ genres });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/Sales', async (req, res) => {
    try {
        // Create and execute our queries
        const viewSales = `SELECT salesID, \
        CONCAT(Customers.firstName,' ',Customers.lastName) AS customer, totalCost, DATE_FORMAT(purchaseDate, '%Y-%m-%d') AS purchaseDate \
        FROM Sales INNER JOIN Customers ON Sales.customerID = Customers.customerID;`;
        const [sales] = await db.query(viewSales);
        res.status(200).json({ sales });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});