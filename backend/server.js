/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: REACT template code and video walkthroughs for CRUD operations
   Summary: Base code adapted from CS340 starter code for server-side routing and database operations. 
            Used for Albums CRUD routes (create, update, delete) and general route structure.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created routes for line items expansion, Sales create/update, AlbumRatings CRUD, Artists CRUD, Customers CRUD, and LineItems CRUD
   Summary: Implemented inline expansion feature for displaying line items within Sales table.
            Created transactional Sales creation that handles customer lookup, total cost calculation, and line item insertion.
            Implemented Sales update for modifying customer, totalCost, and purchaseDate.
            Implemented full CRUD operations for AlbumRatings M:N relationship, Artists entity, Customers entity, and LineItems M:N relationship.
   AI Source URL: https://claude.ai/
*/

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
const PORT = 59695;
// const PORT = 55695; // testing port

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/Albums', async (req, res) => {
    try {
        // Get albums with average rating from AlbumRatings table (NULL if no ratings)
        const viewAlbums = `SELECT 
            Albums.albumID, 
            Albums.albumName, 
            Albums.albumPrice, 
            Albums.amountInStock, 
            Albums.artistID, 
            Albums.genreID,
            ROUND(AVG(AlbumRatings.albumRating), 2) AS avgRating
        FROM Albums
        LEFT JOIN AlbumRatings ON Albums.albumID = AlbumRatings.albumID
        GROUP BY Albums.albumID, Albums.albumName, Albums.albumPrice, Albums.amountInStock, Albums.artistID, Albums.genreID;`;

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
        // Uses LEFT JOIN to show sales even if customer is deleted (customerID is NULL)
        // Displays '<customer deleted>' when customer name is NULL
        const viewSales = `SELECT salesID, \
        COALESCE(CONCAT(Customers.firstName,' ',Customers.lastName), '<customer deleted>') AS customer, totalCost, DATE_FORMAT(purchaseDate, '%Y-%m-%d') AS purchaseDate \
        FROM Sales LEFT JOIN Customers ON Sales.customerID = Customers.customerID;`;
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

        const query = `SELECT lineItemID, Albums.albumName as albumName,
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
        CONCAT(firstName, ' ', lastName) AS customer, 
        phoneNumber, email
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

// CREATE ROUTE for LineItems (M:N)
app.post('/LineItems/create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_CreateLineItem(?, ?, ?, ?, @newID);`;
        const [rows] = await db.query(query, [
            data.salesID,
            data.albumName,
            data.albumPrice,
            data.quantity,
            null
        ]);

        const newID = rows[0][0].new_lineItemID;

        console.log(`CREATE LineItem. ID: ${newID} SalesID: ${data.salesID} Album: ${data.albumName}`);

        res.status(200).json({
            success: true,
            message: 'Line item created successfully',
            new_lineItemID: newID
        });

    } catch (error) {
        console.error('Error creating line item:', error);

        // Check for specific errors
        if (error.sqlMessage && error.sqlMessage.includes('Album not found')) {
            res.status(400).json({
                success: false,
                message: error.sqlMessage
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the line item.'
            });
        }
    }
});

// UPDATE ROUTE for LineItems (M:N)
app.post('/LineItems/update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_UpdateLineItem(?, ?, ?, ?);`;
        await db.query(query, [
            data.lineItemID,
            data.albumName,
            data.albumPrice,
            data.quantity
        ]);

        console.log(`UPDATE LineItem. ID: ${data.lineItemID} Album: ${data.albumName}`);

        res.status(200).json({
            success: true,
            message: 'Line item updated successfully'
        });

    } catch (error) {
        console.error('Error updating line item:', error);

        // Check for specific errors
        if (error.sqlMessage && error.sqlMessage.includes('Album not found')) {
            res.status(400).json({
                success: false,
                message: error.sqlMessage
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the line item.'
            });
        }
    }
});

// DELETE ROUTE for LineItems (M:N)
app.post('/LineItems/delete', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_DeleteLineItem(?);`;
        await db.query(query, [data.lineItemID]);

        console.log(`DELETE LineItem. ID: ${data.lineItemID}`);

        res.status(200).json({
            success: true,
            message: 'Line item deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting line item:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the line item.'
        });
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
                message: 'Cannot delete album. It has associated sales.'
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

// CREATE ROUTE for Sales (with line items)
app.post('/Sales/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Validate line items exist
        if (!data.lineItems || data.lineItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one line item is required'
            });
        }

        // Convert line items to JSON string for stored procedure
        const lineItemsJSON = JSON.stringify(data.lineItems);

        // Call stored procedure with parameterized query
        const query = `CALL sp_CreateSale(?, ?, ?, ?, @newID);`;
        const [rows] = await db.query(query, [
            data.firstName,
            data.lastName,
            data.purchaseDate,
            lineItemsJSON,
            null
        ]);

        // Extract newID from result
        const newSalesID = rows[0][0].new_salesID;

        console.log(`CREATE Sale. ID: ${newSalesID} ` +
            `Customer: ${data.firstName} ${data.lastName} ` +
            `Date: ${data.purchaseDate} ` +
            `Line Items: ${data.lineItems.length}`
        );

        // Send success response back to frontend
        res.status(200).json({
            success: true,
            message: 'Sale created successfully',
            new_salesID: newSalesID
        });

    } catch (error) {
        console.error('Error creating sale:', error);

        // Check for specific errors
        if (error.sqlMessage && error.sqlMessage.includes('No customer found')) {
            res.status(400).json({
                success: false,
                message: 'Customer not found. Please check the name and try again.'
            });
        } else if (error.sqlMessage && error.sqlMessage.includes('Album not found')) {
            res.status(400).json({
                success: false,
                message: 'One or more albums not found. Please check album names.'
            });
        } else {
            // Send a generic error message
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the sale.'
            });
        }
    }
});

// UPDATE ROUTE for Sales
app.post('/Sales/update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_UpdateSale(?, ?, ?, ?);`;
        await db.query(query, [
            data.salesID,
            data.customerFullName,
            data.totalCost,
            data.purchaseDate
        ]);

        console.log(`UPDATE Sale. ID: ${data.salesID} Customer: ${data.customerFullName}`);

        res.status(200).json({
            success: true,
            message: 'Sale updated successfully'
        });

    } catch (error) {
        console.error('Error updating sale:', error);

        // Check for specific errors
        if (error.sqlMessage && error.sqlMessage.includes('Customer not found')) {
            res.status(400).json({
                success: false,
                message: 'Customer not found. Please check the name and try again.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the sale.'
            });
        }
    }
});

// CREATE ROUTE for AlbumRatings (M:N)
app.post('/AlbumRatings/create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_CreateAlbumRating(?, ?, ?, ?, @newID);`;
        const [rows] = await db.query(query, [
            data.albumName,
            data.firstName,
            data.lastName,
            data.albumRating,
            null
        ]);

        const newID = rows[0][0].new_albumRatingID;

        console.log(`CREATE AlbumRating. ID: ${newID} ` +
            `Album: ${data.albumName} ` +
            `Customer: ${data.firstName} ${data.lastName} ` +
            `Rating: ${data.albumRating}`
        );

        res.status(200).json({
            success: true,
            message: 'Album rating created successfully',
            new_albumRatingID: newID
        });

    } catch (error) {
        console.error('Error creating album rating:', error);

        if (error.sqlMessage && error.sqlMessage.includes('Album not found')) {
            res.status(400).json({
                success: false,
                message: 'Album not found. Please select a valid album.'
            });
        } else if (error.sqlMessage && error.sqlMessage.includes('Customer not found')) {
            res.status(400).json({
                success: false,
                message: 'Customer not found. Please check the customer name.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the album rating.'
            });
        }
    }
});

// UPDATE ROUTE for AlbumRatings (M:N)
app.post('/AlbumRatings/update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_UpdateAlbumRating(?, ?, ?, ?);`;
        await db.query(query, [
            data.albumRatingID,
            data.albumName,
            data.customerFullName,
            data.albumRating
        ]);

        console.log(`UPDATE AlbumRating. ID: ${data.albumRatingID} ` +
            `Album: ${data.albumName} ` +
            `Customer: ${data.customerFullName} ` +
            `Rating: ${data.albumRating}`
        );

        res.status(200).json({
            success: true,
            message: 'Album rating updated successfully'
        });

    } catch (error) {
        console.error('Error updating album rating:', error);

        if (error.sqlMessage && error.sqlMessage.includes('Album not found')) {
            res.status(400).json({
                success: false,
                message: 'Album not found. Please select a valid album.'
            });
        } else if (error.sqlMessage && error.sqlMessage.includes('Customer not found')) {
            res.status(400).json({
                success: false,
                message: 'Customer not found. Please check the customer name.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the album rating.'
            });
        }
    }
});

// DELETE ROUTE for AlbumRatings (M:N)
app.post('/AlbumRatings/delete', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_DeleteAlbumRating(?);`;
        await db.query(query, [data.albumRatingID]);

        console.log(`DELETE AlbumRating. ID: ${data.albumRatingID}`);

        res.status(200).json({
            success: true,
            message: 'Album rating deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting album rating:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the album rating.'
        });
    }
});

// CREATE ROUTE for Artists
app.post('/Artists/create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_CreateArtist(?, ?);`;
        await db.query(query, [
            data.artistID,
            data.description
        ]);

        console.log(`CREATE Artist. ID: ${data.artistID} Description: ${data.description}`);

        res.status(200).json({
            success: true,
            message: 'Artist created successfully'
        });

    } catch (error) {
        console.error('Error creating artist:', error);

        // Check for duplicate key error
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({
                success: false,
                message: 'An artist with this ID already exists. Please use a different ID.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the artist.'
            });
        }
    }
});

// UPDATE ROUTE for Artists
app.post('/Artists/update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_UpdateArtist(?, ?);`;
        await db.query(query, [
            data.artistID,
            data.description
        ]);

        console.log(`UPDATE Artist. ID: ${data.artistID} Description: ${data.description}`);

        res.status(200).json({
            success: true,
            message: 'Artist updated successfully'
        });

    } catch (error) {
        console.error('Error updating artist:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the artist.'
        });
    }
});

// DELETE ROUTE for Artists
app.post('/Artists/delete', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_DeleteArtist(?);`;
        await db.query(query, [data.artistID]);

        console.log(`DELETE Artist. ID: ${data.artistID}`);

        res.status(200).json({
            success: true,
            message: 'Artist deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting artist:', error);

        // Check if error is due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({
                success: false,
                message: 'Cannot delete artist. There are albums associated with this artist.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the artist.'
            });
        }
    }
});

// CREATE ROUTE for Customers
app.post('/Customers/create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_CreateCustomer(?, ?, ?, ?, @newID);`;
        const [rows] = await db.query(query, [
            data.firstName,
            data.lastName,
            data.phoneNumber || null,
            data.email || null,
            null
        ]);

        const newID = rows[0][0].new_customerID;

        console.log(`CREATE Customer. ID: ${newID} Name: ${data.firstName} ${data.lastName}`);

        res.status(200).json({
            success: true,
            message: 'Customer created successfully',
            new_customerID: newID
        });

    } catch (error) {
        console.error('Error creating customer:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the customer.'
        });
    }
});

// UPDATE ROUTE for Customers
app.post('/Customers/update', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_UpdateCustomer(?, ?, ?, ?, ?);`;
        await db.query(query, [
            data.customerID,
            data.firstName,
            data.lastName,
            data.phoneNumber || null,
            data.email || null
        ]);

        console.log(`UPDATE Customer. ID: ${data.customerID} Name: ${data.firstName} ${data.lastName}`);

        res.status(200).json({
            success: true,
            message: 'Customer updated successfully'
        });

    } catch (error) {
        console.error('Error updating customer:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the customer.'
        });
    }
});

// DELETE ROUTE for Customers
app.post('/Customers/delete', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_DeleteCustomer(?);`;
        await db.query(query, [data.customerID]);

        console.log(`DELETE Customer. ID: ${data.customerID}`);

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting customer:', error);

        // Check if error is due to foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({
                success: false,
                message: 'Cannot delete customer. There are sales or ratings associated with this customer.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the customer.'
            });
        }
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});