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

-- get all attributes for the Albums page
-- includes average rating from AlbumRatings table (NULL if no ratings)
SELECT Albums.albumID, Albums.albumName, Albums.albumPrice, Albums.amountInStock, Albums.artistID, Albums.genreID, ROUND(
        AVG(AlbumRatings.albumRating), 2
    ) AS avgRating
FROM Albums
    LEFT JOIN AlbumRatings ON Albums.albumID = AlbumRatings.albumID
GROUP BY
    Albums.albumID,
    Albums.albumName,
    Albums.albumPrice,
    Albums.amountInStock,
    Albums.artistID,
    Albums.genreID;

-- get albums for dropdown selection (optimized - only essential fields)
-- Note: Uses main /Albums route, no separate endpoint needed
SELECT albumID, albumName, albumPrice FROM Albums;

-- get all genres to populate the Genres dropdown
SELECT genreID FROM Genres;

-- add a new album
INSERT INTO
    Albums (
        albumName,
        albumPrice,
        amountInStock,
        artistID,
        genreID
    )
VALUES (
        @albumName,
        @albumPrice,
        @amountInStock,
        @artistID,
        @genreID
    );

-- update an album based on submission of the Update Albums form
UPDATE Albums
SET
    albumName = @albumName,
    albumPrice = @albumPrice,
    amountInStock = @amountInStock,
    artistID = @artistID,
    genreID = @genreID
WHERE
    albumID = @albumID;

-- delete an album
DELETE FROM Albums WHERE albumID = @albumID;

---                             |
--- DML for Artists entity      |
---                             |

-- get all attributes for the List Artists page
SELECT artistID, description from Artists;

-- add a new artist
-- Note: actual implementation uses sp_CreateArtist stored procedure
INSERT INTO
    Artists (artistID, description)
VALUES (@artistID, @description);

-- update an artist based on submission of the Update Artists form
-- Note: actual implementation uses sp_UpdateArtist stored procedure
UPDATE Artists
SET
    description = @description
WHERE
    artistID = @artistID;

-- delete an artist
-- Note: actual implementation uses sp_DeleteArtist stored procedure
DELETE FROM Artists WHERE artistID = @artistID;

---                             |
--- DML for Genres entity       |
---                             |

-- get all attributes for the List Genres page
SELECT genreID, description FROM Genres;

---                             |
--- DML for Customers entity    |
---                             |

-- get all attributes for the List Customers page
-- displays concatenated customer name instead of separate firstName/lastName
SELECT
    customerID,
    CONCAT(firstName, ' ', lastName) AS customer,
    phoneNumber,
    email
FROM Customers;

-- add a new customer
-- Note: actual implementation uses sp_CreateCustomer stored procedure
INSERT INTO
    Customers (
        firstName,
        lastName,
        phoneNumber,
        email
    )
VALUES (
        @firstName,
        @lastName,
        @phoneNumber,
        @email
    );

-- update a customer based on submission of the Update Customers form
-- Note: Frontend parses full name (e.g., "John Smith") into firstName/lastName in JavaScript
-- Note: Actual implementation uses sp_UpdateCustomer stored procedure
UPDATE Customers
SET
    firstName = @firstName,
    lastName = @lastName,
    phoneNumber = @phoneNumber,
    email = @email
WHERE
    customerID = @customerID;

-- delete a customer
-- Note: actual implementation uses sp_DeleteCustomer stored procedure
DELETE FROM Customers WHERE customerID = @customerID;

---                             |
--- DML for AlbumRatings entity |
---                             |

-- get all attributes for the List AlbumRatings page
SELECT
    albumRatingID,
    albumRating,
    Albums.albumName,
    CONCAT(
        Customers.firstName,
        ' ',
        Customers.lastName
    ) AS customer
FROM
    AlbumRatings
    INNER JOIN Customers ON AlbumRatings.customerID = Customers.customerID
    INNER JOIN Albums ON AlbumRatings.albumID = Albums.albumID;

-- associate an album rating with a customer (M-to-M relationship addition)
-- Note: Actual implementation uses sp_CreateAlbumRating stored procedure
INSERT INTO
    AlbumRatings (
        albumID,
        customerID,
        albumRating
    )
VALUES (
        (
            SELECT albumID
            FROM Albums
            WHERE
                albumName = @albumName
        ),
        (
            SELECT customerID
            FROM Customers
            WHERE
                firstName = @firstName
                AND lastName = @lastName
        ),
        @albumRating
    );

-- update an AlbumRating based on submission of the Update AlbumRating form
-- Note: Actual implementation uses sp_UpdateAlbumRating stored procedure
UPDATE AlbumRatings
SET
    albumRating = @albumRating,
    albumID = (
        SELECT albumID
        FROM Albums
        WHERE
            albumName = @albumName
    ),
    customerID = (
        SELECT customerID
        FROM Customers
        WHERE
            firstName = SUBSTRING_INDEX(@customerFullName, ' ', 1)
            AND lastName = SUBSTRING_INDEX(@customerFullName, ' ', -1)
    )
WHERE
    albumRatingID = @albumRatingID;

-- delete an album rating
-- Note: Actual implementation uses sp_DeleteAlbumRating stored procedure
DELETE FROM AlbumRatings WHERE albumRatingID = @albumRatingID;

---                             |
--- DML for Sales entity        |
---                             |

-- get all attributes for the List Sales page
-- uses LEFT JOIN to show sales even if customer is deleted (customerID is NULL)
-- displays '<customer deleted>' when customer name is NULL
SELECT
    salesID,
    COALESCE(
        CONCAT(
            Customers.firstName,
            ' ',
            Customers.lastName
        ),
        '<customer deleted>'
    ) AS customer,
    totalCost,
    purchaseDate
FROM Sales
    LEFT JOIN Customers ON Sales.customerID = Customers.customerID;

-- add a new sale
-- Note: This query shows the logical flow. The actual implementation uses sp_CreateSale stored procedure
-- which handles the transaction, customer lookup, total cost calculation, and line item insertion
INSERT INTO
    Sales (
        customerID,
        totalCost,
        purchaseDate
    )
VALUES (
        (
            SELECT customerID
            FROM Customers
            WHERE
                firstName = @firstName
                AND lastName = @lastName
        ),
        @totalCost,
        @purchaseDate
    );

-- update a sale based on submission of the Update Sales form
-- Note: actual implementation uses sp_UpdateSale stored procedure
-- customerFullName can be NULL, empty, or '<customer deleted>' to set customerID to NULL
UPDATE Sales
SET
    customerID = (
        SELECT customerID
        FROM Customers
        WHERE
            firstName = SUBSTRING_INDEX(@customerFullName, ' ', 1)
            AND lastName = SUBSTRING_INDEX(@customerFullName, ' ', -1)
    ),
    totalCost = @totalCost,
    purchaseDate = @purchaseDate
WHERE
    salesID = @salesID;

-- lookup lineitems for a sale, to be implemented when pushing Line Items button
SELECT
    lineItemID,
    Albums.albumName as albumName,
    LineItems.albumPrice as albumPrice,
    quantity,
    quantity * LineItems.albumPrice AS lineItemTotal
FROM LineItems
    INNER JOIN Albums ON LineItems.albumID = Albums.albumID
WHERE
    LineItems.salesID = @salesID;

---                             |
--- DML for LineItems entity    |
---                             |

-- get all attributes for the List LineItems page
SELECT
    lineItemID,
    salesID,
    Albums.albumName as albumName,
    LineItems.albumPrice as albumPrice, -- snapshot of price at time of sale
    quantity,
    quantity * LineItems.albumPrice AS lineItemTotal
FROM LineItems
    INNER JOIN Albums ON LineItems.albumID = Albums.albumID;

-- associate a sales line item with an album (M-to-M relationship addition)
-- Note: actual implementation uses sp_CreateLineItem stored procedure
INSERT INTO
    LineItems (
        salesID,
        albumID,
        albumPrice,
        quantity
    )
VALUES (
        @salesID,
        (
            SELECT albumID
            FROM Albums
            WHERE
                albumName = @albumName
        ),
        @albumPrice,
        @quantity
    );

-- update a lineItem based on submission of the Update Line Items form
-- Note: actual implementation uses sp_UpdateLineItem stored procedure
UPDATE LineItems
SET
    albumID = (
        SELECT albumID
        FROM Albums
        WHERE
            albumName = @albumName
    ),
    albumPrice = @albumPrice,
    quantity = @quantity
WHERE
    lineItemID = @lineItemID;

-- delete a line item
-- Note: actual implementation uses sp_DeleteLineItem stored procedure
DELETE FROM LineItems WHERE lineItemID = @lineItemID;