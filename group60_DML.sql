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
SELECT albumID, albumName, albumPrice, amountInStock, artistID, genreID FROM Albums;

-- get all genres to populate the Genres dropdown
SELECT genreID FROM Genres;

-- add a new album
INSERT INTO Albums (albumName, albumPrice, amountInStock, artistID, genreID)
VALUES (@albumName, @albumPrice, @amountInStock, @artistID, @genreID);

-- update an album based on submission of the Update Albums form 
UPDATE Albums
SET albumName = @albumName, albumPrice= @albumPrice, amountInStock = @amountInStock, artistID = @artistID, genreID = @genreID
WHERE albumID = @albumID;

-- delete an album
DELETE FROM Albums WHERE albumID = @albumID;

---                             |
--- DML for Artists entity      |
---                             |

-- get all attributes for the List Artists page
SELECT artistID, description from Artists;

-- add a new artist
INSERT INTO Artists (artistID, description)
VALUES (@artistID, @description);

-- update an artist based on submission of the Update Artists form 
UPDATE Artists
SET artistID = @artistID, description = @description
WHERE artistID = @artistID;

-- delete an artist
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
SELECT customerID, CONCAT(firstName,' ',lastName) AS customer, phoneNumber, email
FROM Customers;

-- add a new customer
INSERT INTO Customers (firstName, lastName, phoneNumber, email)
VALUES (@firstName, @lastName, @phoneNumber, @email);

-- update a customer based on submission of the Update Customers form 
UPDATE Customers
SET 
    firstName = SUBSTRING_INDEX(@customerFullName, ' ', 1),
    lastName = SUBSTRING_INDEX(@customerFullName, ' ', -1),
    phoneNumber = @phoneNumber,
    email = @email
WHERE customerID = @customerID;

-- delete a customer
DELETE FROM Customers WHERE customerID = @customerID;

---                             |
--- DML for AlbumRatings entity |
---                             |

-- get all attributes for the List AlbumRatings page
SELECT albumRatingID, albumRating, Albums.albumName, CONCAT(Customers.firstName,' ',Customers.lastName) AS customer
FROM AlbumRatings
INNER JOIN Customers ON AlbumRatings.customerID = Customers.customerID
INNER JOIN Albums ON AlbumRatings.albumID = Albums.albumID;

-- associate an album rating with a customer (M-to-M relationship addition)
INSERT INTO AlbumRatings (albumID, customerID, albumRating)
VALUES (
    (SELECT albumID FROM Albums WHERE albumName = @albumName),
    (SELECT customerID FROM Customers WHERE firstName = @firstName AND lastName = @lastName),
    @albumRating
);

-- update an AlbumRating based on submission of the Update AlbumRating form 
UPDATE AlbumRatings
SET albumRating = @albumRating, 
    albumID = (SELECT albumID FROM Albums WHERE albumName = @albumName),
    customerID = (
        SELECT customerID 
        FROM Customers 
        WHERE firstName = SUBSTRING_INDEX(@customerFullName, ' ', 1) 
        AND lastName = SUBSTRING_INDEX(@customerFullName, ' ', -1)
    )
WHERE albumRatingID = @albumRatingID;

-- delete an album rating
DELETE FROM AlbumRatings WHERE albumRatingID = @albumRatingID;

---                             |
--- DML for Sales entity        |
---                             |

-- get all attributes for the List Sales page
SELECT salesID, CONCAT(Customers.firstName,' ',Customers.lastName) AS customer, totalCost, purchaseDate
FROM Sales
INNER JOIN Customers ON Sales.customerID = Customers.customerID;

-- add a new sale
INSERT INTO Sales (customerID, totalCost, purchaseDate)
VALUES (
    (SELECT customerID FROM Customers WHERE firstName = @firstName AND lastName = @lastName),
    @totalCost,
    @purchaseDate
);

-- lookup lineitems for a sale, to be implemented when pushing Line Items button
SELECT lineItemID, salesID, albumID, albumPrice, quantity, quantity * albumPrice AS lineItemTotal
FROM LineItems WHERE salesID = @salesID;

---                             |
--- DML for LineItems entity    |
---                             |

-- get all attributes for the List LineItems page
SELECT lineItemID, salesID, Albums.albumName as albumName, LineItems.albumPrice as albumPrice, -- snapshot of price at time of sale
quantity, quantity * LineItems.albumPrice AS lineItemTotal
FROM LineItems
INNER JOIN Albums ON LineItems.albumID = Albums.albumID;

-- associate a sales line item with an album (M-to-M relationship addition)
INSERT INTO LineItems (salesID, albumID, albumPrice, quantity) 
VALUES (
    @salesID, 
    (SELECT albumID FROM Albums WHERE albumName = @albumName),
    @albumPrice,
    @quantity
);

-- update a lineItem based on submission of the Update Line Items form 
UPDATE LineItems
SET 
    salesID = @salesID, 
    albumID = (SELECT albumID FROM Albums WHERE albumName = @albumName), 
    albumPrice = @albumPrice 
WHERE lineItemID = @lineItemID;

-- delete a line item
DELETE FROM LineItems WHERE lineItemID = @lineItemID;