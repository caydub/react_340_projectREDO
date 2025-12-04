// This module adapted from the starter code provided in CS340 Modules/Explorations

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
// const PORT = 59695;
const PORT = 95695; // testing backend port

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

app.get('/Sales/:salesID/lineitems', async (req, res) => {
    try {
        const salesID = req.params.salesID;

        const query = `SELECT lineItemID, salesID, Albums.albumName as albumName,
            LineItems.albumPrice as albumPrice, quantity, quantity * LineItems.albumPrice AS lineItemTotal
            FROM LineItems 
            INNER JOIN Albums ON LineItems.albumID = Albums.albumID
            WHERE LineItems.salesID = ?;`;

        const [lineItems] = await db.query(query, [salesID]);

        res.status(200).json({ lineItems });

    } catch (error) {
        console.error("Error executing line items query:", error);
        res.status(500).send("An error occurred while retrieving line items.");
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

// RESET DATABASE ROUTE
app.post('/reset', async function (req, res) {
    try {
        // Execute the stored procedure to reset sample data
        const query = `CALL sp_reset_sample_data();`;

        await db.query(query);

        console.log('Database reset successfully - sample data restored');

        // Send success status to frontend
        res.status(200).json({
            message: 'Database reset successfully. Sample data has been restored.'
        });
    } catch (error) {
        console.error('Error resetting database:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while resetting the database.'
        );
    }
});

// DELETE ROUTE for Albums
// Source: CS340 Week 8 Modules/Explorations (November 2025)
// Purpose: REACT template code and video walkthrough for CUD (Create, Update, Delete) operations
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
app.post('/Albums/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteAlbum(?);`;
        await db.query(query1, [data.albumID]);

        console.log(`DELETE Album. ID: ${data.albumID} ` +
            `Name: ${data.albumName || 'N/A'}`
        );

        // Send success response back to frontend
        res.status(200).json({
            success: true,
            message: 'Album deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting album:', error);

        // Check if error is due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({
                success: false,
                message: 'Cannot delete album. It has associated ratings or sales.'
            });
        } else {
            // Send a generic error message
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the album.'
            });
        }
    }
});

// UPDATE ROUTE for Albums
// Source: CS340 Week 8 Modules/Explorations (November 2025)
// Purpose: REACT template code and video walkthrough for CUD (Create, Update, Delete) operations
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
app.post('/Albums/update', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_UpdateAlbum(?, ?, ?, ?, ?, ?);`;
        await db.query(query1, [data.albumID, data.albumName, data.albumPrice, data.amountInStock, data.artistID, data.genreID]);

        console.log(`UPDATE Album. ID: ${data.albumID} ` +
            ` Name: ${data.albumName || 'N/A'}` +
            ` Price: ${data.albumPrice || 'N/A'}` +
            ` AmountInStock: ${data.amountInStock || 'N/A'}` +
            ` ArtistID: ${data.artistID || 'N/A'}` +
            ` GenreID: ${data.genreID || 'N/A'}`
        );

        // Send success response back to frontend
        res.status(200).json({
            success: true,
            message: 'Album updated successfully'
        });

    } catch (error) {
        console.error('Error updating album:', error);

        // Check if error is due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({
                success: false,
                message: 'Cannot update album. It has associated ratings or sales.'
            });
        } else {
            // Send a generic error message
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the album.'
            });
        }
    }
});

// CREATE ROUTE for Albums
// Source: CS340 Week 8 Modules/Explorations (November 2025)
// Purpose: REACT template code and video walkthrough for CUD (Create, Update, Delete) operations
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
app.post('/Albums/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateAlbum(?, ?, ?, ?, ?, @newID);`;
        const [rows] = await db.query(query1, [data.albumName, data.albumPrice, data.amountInStock, data.artistID, data.genreID, null]);
        // Extract newID from SELECT LAST_INSERT_ID() AS 'new_albumID';
        const newID = rows[0][0].new_albumID;

        console.log(`CREATE Album. ID: ${newID} ` +
            ` Name: ${data.albumName || 'N/A'}` +
            ` Price: ${data.albumPrice || 'N/A'}` +
            ` AmountInStock: ${data.amountInStock || 'N/A'}` +
            ` ArtistID: ${data.artistID || 'N/A'}` +
            ` GenreID: ${data.genreID || 'N/A'}`
        );

        // Send success response back to frontend
        res.status(200).json({
            success: true,
            message: 'Album created successfully',
            new_albumID: newID
        });

    } catch (error) {
        console.error('Error creating album:', error);

        // Check if error is due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({
                success: false,
                message: 'Cannot create album. Invalid artist name.'
            });
        } else {
            // Send a generic error message
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the album.'
            });
        }
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});