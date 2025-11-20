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

// DELETE Albums
app.post('/Albums/delete', async (req, res) => {
    try {
        // Parse frontend form info
        const data = req.body;

        // Create and execute our qeury
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_DeleteAlbum(?);';
        await db.query(query1, [data.delete_album_ID]);

        console.log(`Deleted Album.id: ${data.delete_album_ID}`);

        res.redirect('/Albums');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while executing the album database queries.');
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

app.get('/Customers', async (req, res) => {
    try {
        const viewCustomers = `SELECT customerID,
        CONCAT(firstName, ' ', lastName) AS customer, phoneNumber, email
        FROM Customers;`;
        const [customers] = await db.query(viewCustomers);
        res.status(200).json({ customers });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/AlbumRatings', async (req, res) => {
    try {
        const viewAlbumRatings = `SELECT albumRatingID, albumRating, Albums.albumName,
        CONCAT(Customers.firstName,' ',Customers.lastName) AS customer FROM AlbumRatings
        INNER JOIN Customers ON AlbumRatings.customerID = Customers.customerID
        INNER JOIN Albums ON AlbumRatings.albumID = Albums.albumID;`;

        const [albumRatings] = await db.query(viewAlbumRatings);
        res.status(200).json({ albumRatings });

    } catch (error) {
        console.error("Error executing AlbumRatings query:", error);
        res.status(500).send("An error occurred while retrieving Album Ratings.");
    }
});

app.get('/LineItems', async (req, res) => {
    try {
        const viewLineItems = `SELECT lineItemID, salesID, Albums.albumName as albumName,
        LineItems.albumPrice as albumPrice, quantity, quantity * LineItems.albumPrice AS lineItemTotal
        FROM LineItems INNER JOIN Albums ON LineItems.albumID = Albums.albumID;`;

        const [lineItems] = await db.query(viewLineItems);
        res.status(200).json({ lineItems });

    } catch (error) {
        console.error("Error executing LineItems query:", error);
        res.status(500).send("An error occurred while retrieving Line Items.");
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});