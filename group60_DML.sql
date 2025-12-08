-- Citations:
--
-- Original Source: CS340 Course Template
-- Date: October-November 2025
-- Purpose: Base DML query examples and structure
-- Source URL: https://canvas.oregonstate.edu/courses/2017561/
--
-- AI Model: Claude 3.5 Sonnet
-- Dates: 12/04/2025 (Sales UPDATE, avgRating, Customers display), 12/07/2025 (Dropdown queries)
--
-- Purpose - 12/04/2025: Updated queries and added frontend logic documentation
-- Summary: Updated Albums SELECT to include avgRating calculation, updated Customers SELECT 
--          to show concatenated names, updated Sales SELECT with LEFT JOIN for NULL customers,
--          added Sales UPDATE documentation, added comments for frontend name parsing logic.
--
--
-- AI Source URL: https://claude.ai/

--- DML for group60 database
--- Caleb Richter & Andrew Walsh
---
--- Note, parameters are prefixed with '@' to indicate they are to be provided at runtime
--- Also, some primary keys are assumed to be auto-incrementing unless otherwise noted
--- and thus are generally not included in INSERT statements. ArtistID and GenreID are exceptions
--- as they are VARCHAR types and not auto-incrementing. Their IDs serve as primary keys 
--- and are also meaningful descriptors/identifiers so no extra name attribute was needed.
---
---                             |
--- DML for Albums entity       |
---                             |

-- get all attributes for the Albums page (including calculated avgRating)
-- avgRating is calculated as ROUND(AVG(albumRating), 2) from AlbumRatings table
-- LEFT JOIN ensures albums with no ratings still appear (avgRating will be NULL)
SELECT 
    a.albumID, 
    a.albumName, 
    a.albumPrice, 
    a.amountInStock, 
    a.artistID, 
    a.genreID,
    ROUND(AVG(ar.albumRating), 2) AS avgRating
FROM Albums a
LEFT JOIN AlbumRatings ar ON a.albumID = ar.albumID
GROUP BY a.albumID;

-- get all artists to populate the Artist dropdown in CreateAlbumForm
-- Returns artistID and description (description fetched but only artistID displayed in dropdown)
SELECT artistID, description FROM Artists;

-- get all genres to populate the Genre dropdown in CreateAlbumForm
-- Returns genreID and description (description fetched but only genreID displayed in dropdown)
SELECT genreID, description FROM Genres;

-- add a new album
-- Called via stored procedure: CALL sp_CreateAlbum(@albumName, @albumPrice, @amountInStock, @artistID, @genreID);
INSERT INTO Albums (albumName, albumPrice, amountInStock, artistID, genreID)
VALUES (@albumName, @albumPrice, @amountInStock, @artistID, @genreID);

-- update an album based on submission of the Update Albums form
-- Called via stored procedure: CALL sp_UpdateAlbum(@albumID, @albumName, @albumPrice, @amountInStock, @artistID, @genreID);
-- Note: avgRating is NOT updated here as it's a calculated field from AlbumRatings table
UPDATE Albums
SET 
    albumName = @albumName, 
    albumPrice = @albumPrice, 
    amountInStock = @amountInStock, 
    artistID = @artistID, 
    genreID = @genreID
WHERE albumID = @albumID;

-- delete an album
-- Called via stored procedure: CALL sp_DeleteAlbum(@albumID);
-- CASCADE: This will also delete all AlbumRatings for this album (ON DELETE CASCADE)
DELETE FROM Albums WHERE albumID = @albumID;

---                             |
--- DML for Artists entity      |
---                             |

-- get all attributes for the List Artists page
-- Also used to populate Artist dropdown in CreateAlbumForm
SELECT artistID, description FROM Artists;

-- add a new artist
-- Called via stored procedure: CALL sp_CreateArtist(@artistID, @description);
INSERT INTO Artists (artistID, description)
VALUES (@artistID, @description);

-- update an artist based on submission of the Update Artists form
-- Called via stored procedure: CALL sp_UpdateArtist(@artistID, @newArtistID, @description);
UPDATE Artists
SET artistID = @newArtistID, description = @description
WHERE artistID = @artistID;

-- delete an artist
-- Called via stored procedure: CALL sp_DeleteArtist(@artistID);
-- Will be BLOCKED if artist has albums (ON DELETE NO ACTION)
DELETE FROM Artists WHERE artistID = @artistID;

---                             |
--- DML for Genres entity       |
---                             |

-- get all attributes for the List Genres page
-- Also used to populate Genre dropdown in CreateAlbumForm
SELECT genreID, description FROM Genres;

-- Note: Genres is read-only reference data, no CUD operations

---                             |
--- DML for Customers entity    |
---                             |

-- get all attributes for the List Customers page
-- CONCAT displays customer name as single "First Last" field (no separate columns)
-- Frontend parses "First Last" back into firstName/lastName for UPDATE operations
SELECT 
    customerID, 
    CONCAT(firstName, ' ', lastName) AS customer, 
    phoneNumber, 
    email
FROM Customers;

-- add a new customer
-- Called via stored procedure: CALL sp_CreateCustomer(@firstName, @lastName, @phoneNumber, @email);
-- Frontend parses single name input "First Last" into @firstName and @lastName before calling
INSERT INTO Customers (firstName, lastName, phoneNumber, email)
VALUES (@firstName, @lastName, @phoneNumber, @email);

-- update a customer based on submission of the Update Customers form
-- Called via stored procedure: CALL sp_UpdateCustomer(@customerID, @firstName, @lastName, @phoneNumber, @email);
-- Frontend parses single name input "First Last" into @firstName and @lastName before calling
UPDATE Customers
SET 
    firstName = @firstName,
    lastName = @lastName,
    phoneNumber = @phoneNumber,
    email = @email
WHERE customerID = @customerID;

-- delete a customer
-- Called via stored procedure: CALL sp_DeleteCustomer(@customerID);
-- CASCADE: Deletes all AlbumRatings for this customer (ON DELETE CASCADE)
-- SET NULL: Sets Sales.customerID to NULL (ON DELETE SET NULL) - sales are preserved
DELETE FROM Customers WHERE customerID = @customerID;

---                             |
--- DML for AlbumRatings entity |
---                             |

-- get all attributes for the List AlbumRatings page (M:N relationship)
-- Shows album name and customer full name instead of IDs
SELECT 
    albumRatingID, 
    albumRating, 
    Albums.albumName, 
    CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer
FROM AlbumRatings
INNER JOIN Customers ON AlbumRatings.customerID = Customers.customerID
INNER JOIN Albums ON AlbumRatings.albumID = Albums.albumID;

-- associate an album rating with a customer (M-to-M relationship addition)
-- Called via stored procedure: CALL sp_CreateAlbumRating(@albumName, @firstName, @lastName, @albumRating);
-- Uses natural key lookups: albumName → albumID, firstName/lastName → customerID
-- Frontend parses single customer name input "First Last" into @firstName and @lastName before calling
INSERT INTO AlbumRatings (albumID, customerID, albumRating)
VALUES (
    (SELECT albumID FROM Albums WHERE albumName = @albumName),
    (SELECT customerID FROM Customers WHERE firstName = @firstName AND lastName = @lastName),
    @albumRating
);

-- update an AlbumRating based on submission of the Update AlbumRating form
-- Called via stored procedure: CALL sp_UpdateAlbumRating(@albumRatingID, @albumName, @firstName, @lastName, @albumRating);
-- Uses natural key lookups: albumName → albumID, firstName/lastName → customerID
-- Frontend parses single customer name input "First Last" into @firstName and @lastName before calling
UPDATE AlbumRatings
SET 
    albumRating = @albumRating, 
    albumID = (SELECT albumID FROM Albums WHERE albumName = @albumName),
    customerID = (
        SELECT customerID 
        FROM Customers 
        WHERE firstName = @firstName 
        AND lastName = @lastName
    )
WHERE albumRatingID = @albumRatingID;

-- delete an album rating (M:N relationship removal)
-- Called via stored procedure: CALL sp_DeleteAlbumRating(@albumRatingID);
-- Only removes the rating record, does NOT delete the album or customer
DELETE FROM AlbumRatings WHERE albumRatingID = @albumRatingID;

---                             |
--- DML for Sales entity        |
---                             |

-- get all attributes for the List Sales page
-- LEFT JOIN handles deleted customers (customerID = NULL)
-- COALESCE displays '<customer deleted>' for NULL customers
SELECT 
    s.salesID, 
    COALESCE(CONCAT(c.firstName, ' ', c.lastName), '<customer deleted>') AS customer, 
    s.customerID,
    s.totalCost, 
    s.purchaseDate
FROM Sales s
LEFT JOIN Customers c ON s.customerID = c.customerID;

-- add a new sale
-- Called via stored procedure: CALL sp_CreateSale(@customerID, @totalCost, @purchaseDate);
-- customerID can be NULL for anonymous sales
INSERT INTO Sales (customerID, totalCost, purchaseDate)
VALUES (@customerID, @totalCost, @purchaseDate);

-- update a sale based on submission of the Update Sales form
-- Called via stored procedure: CALL sp_UpdateSale(@salesID, @firstName, @lastName, @totalCost, @purchaseDate);
-- If @firstName and @lastName are provided: looks up customerID
-- If @firstName and @lastName are NULL/empty: sets customerID to NULL
-- Frontend sends NULL for anonymous sales or parsed firstName/lastName for customer lookup
UPDATE Sales
SET 
    customerID = (
        SELECT customerID 
        FROM Customers 
        WHERE firstName = @firstName AND lastName = @lastName
    ),
    totalCost = @totalCost,
    purchaseDate = @purchaseDate
WHERE salesID = @salesID;

-- Note: No DELETE operation for Sales (intentionally omitted for accounting preservation)

-- lookup lineitems for a sale, to be implemented when pushing Line Items button
SELECT 
    lineItemID, 
    salesID, 
    albumID, 
    albumPrice, 
    quantity, 
    quantity * albumPrice AS lineItemTotal
FROM LineItems 
WHERE salesID = @salesID;

---                             |
--- DML for LineItems entity    |
---                             |

-- get all attributes for the List LineItems page (M:N relationship)
-- albumPrice in LineItems is snapshot of price at time of sale (may differ from current Albums.albumPrice)
SELECT 
    lineItemID, 
    salesID, 
    Albums.albumName AS albumName, 
    LineItems.albumPrice AS albumPrice, 
    quantity, 
    quantity * LineItems.albumPrice AS lineItemTotal
FROM LineItems
INNER JOIN Albums ON LineItems.albumID = Albums.albumID;

-- associate a sales line item with an album (M-to-M relationship addition)
-- Called via stored procedure: CALL sp_CreateLineItem(@salesID, @albumName, @quantity, @albumPrice);
-- Uses natural key lookup: albumName → albumID
-- albumPrice is captured at time of sale (historical price)
INSERT INTO LineItems (salesID, albumID, albumPrice, quantity) 
VALUES (
    @salesID, 
    (SELECT albumID FROM Albums WHERE albumName = @albumName),
    @albumPrice,
    @quantity
);

-- update a lineItem based on submission of the Update Line Items form
-- Called via stored procedure: CALL sp_UpdateLineItem(@lineItemID, @salesID, @albumName, @quantity, @albumPrice);
-- Uses natural key lookup: albumName → albumID
UPDATE LineItems
SET 
    salesID = @salesID, 
    albumID = (SELECT albumID FROM Albums WHERE albumName = @albumName), 
    albumPrice = @albumPrice,
    quantity = @quantity
WHERE lineItemID = @lineItemID;

-- delete a line item (M:N relationship removal)
-- Called via stored procedure: CALL sp_DeleteLineItem(@lineItemID);
-- Only removes the line item record, does NOT delete the sale or album
DELETE FROM LineItems WHERE lineItemID = @lineItemID;