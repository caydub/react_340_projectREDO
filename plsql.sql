/* Citations:

Source: CS340 Modules/Explorations
Date: November 2025
Purpose: Stored procedure patterns and transaction management
Summary: Base stored procedure structure adapted from CS340 starter code.
Used for error handling, transaction management, and parameter patterns.
Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

AI Model: Claude 3.5 Sonnet
Date: 12/04/2025
Purpose: Created stored procedures for Sales, AlbumRatings, Artists, Customers, and LineItems entities
Summary: Implemented sp_CreateSale with JSON-based line items for transactional sale creation.
Implemented sp_UpdateSale with customer name parsing for updating sales records.
Implemented sp_CreateAlbumRating, sp_UpdateAlbumRating, sp_DeleteAlbumRating for M:N relationship management.
Implemented sp_CreateArtist, sp_UpdateArtist, sp_DeleteArtist for Artists entity CRUD operations.
Implemented sp_CreateCustomer, sp_UpdateCustomer, sp_DeleteCustomer for Customers entity CRUD operations.
Implemented sp_CreateLineItem, sp_UpdateLineItem, sp_DeleteLineItem for LineItems M:N relationship management.
AI Source URL: https://claude.ai/
*/

-- ================================================================
-- ALBUMS STORED PROCEDURES
-- ================================================================

DROP PROCEDURE sp_CreateAlbum;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateAlbum`(
    IN p_albumName VARCHAR(100),
    IN p_albumPrice DECIMAL(4,2),
    IN p_amountInStock INT,
    IN p_artistID VARCHAR(50),
    IN p_genreID VARCHAR(50),
    OUT p_newID INT
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Albums (albumName, albumPrice, amountInStock, artistID, genreID)
        VALUES (p_albumName, p_albumPrice, p_amountInStock, p_artistID, p_genreID);

        SELECT LAST_INSERT_ID() INTO p_newID;
        SELECT LAST_INSERT_ID() AS 'new_albumID';
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE sp_DeleteAlbum;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_DeleteAlbum`(IN p_albumID INT)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Albums WHERE albumID = p_albumID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in Albums for id: ', p_albumID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE sp_UpdateAlbum;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateAlbum`(
    IN p_albumID INT,
    IN p_albumName VARCHAR(100),
    IN p_albumPrice DECIMAL(4,2),
    IN p_amountInStock INT,
    IN p_artistID VARCHAR(50),
    IN p_genreID VARCHAR(50)
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Albums
        SET albumName = p_albumName,
            albumPrice = p_albumPrice,
            amountInStock = p_amountInStock,
            artistID = p_artistID,
            genreID = p_genreID
        WHERE albumID = p_albumID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in Albums for id: ', p_albumID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE sp_reset_sample_data;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_reset_sample_data`()
BEGIN
    -- Tidying up the place
    SET FOREIGN_KEY_CHECKS=0;
    
    -- Drop and recreate all tables
    
    --
    -- Table structure for 'Artists'
    -- 1:M between Artists and Albums
    --
    DROP TABLE IF EXISTS Artists;
    CREATE TABLE Artists (
        artistID varchar(50) NOT NULL UNIQUE,
        description varchar(255) NOT NULL,
        PRIMARY KEY (artistID)
    );

    --
    -- Table structure for 'Genres'
    -- 1:M between Genres and Albums
    --
    DROP TABLE IF EXISTS Genres;
    CREATE TABLE Genres (
        genreID varchar(50) NOT NULL UNIQUE,
        description varchar(255) NOT NULL,
        PRIMARY KEY (genreID)
    );

    --
    -- Table structure for 'Albums'
    -- M:1 between Albums and Artists
    -- M:1 between Albums and Genres
    -- M:N between Albums and Sales through LineItems
    -- M:N between Albums and Customers through AlbumRatings
    --
    DROP TABLE IF EXISTS Albums;
    CREATE TABLE Albums (
        albumID int NOT NULL AUTO_INCREMENT UNIQUE,
        albumName varchar(100) NOT NULL,
        albumPrice decimal(4,2) NOT NULL,
        amountInStock int NOT NULL DEFAULT 0,
        artistID varchar(50),
        genreID varchar(50),
        PRIMARY KEY (albumID),
        FOREIGN KEY (artistID) REFERENCES Artists(artistID)
        ON DELETE NO ACTION,
        FOREIGN KEY (genreID) REFERENCES Genres(genreID)
        ON DELETE NO ACTION
    );

    --
    -- Table structure for 'Customers'
    -- 1:M between Customers and Albums
    -- 1:M between Customers and Sales
    -- M:N between Customers and Albums through AlbumRatings
    --
    DROP TABLE IF EXISTS Customers;
    CREATE TABLE Customers (
        customerID int NOT NULL AUTO_INCREMENT UNIQUE,
        firstName varchar(45) NOT NULL,
        lastName varchar(45) NOT NULL,
        phoneNumber varchar(15) DEFAULT NULL,
        email varchar(50) DEFAULT NULL,
        PRIMARY KEY (customerID)
    );

    --
    -- Table structure for 'AlbumsRatings'
    -- Intersection table for Customers and Albums
    --
    DROP TABLE IF EXISTS AlbumRatings;
    CREATE TABLE AlbumRatings (
        albumRatingID int NOT NULL AUTO_INCREMENT UNIQUE,
        albumRating decimal(2,1) NOT NULL,
        albumID int,
        customerID int,
        PRIMARY KEY (albumRatingID),
        FOREIGN KEY (albumID) REFERENCES Albums(albumID)
        ON DELETE CASCADE,
        FOREIGN KEY (customerID) REFERENCES Customers(customerID)
        ON DELETE CASCADE
    );

    --
    -- Table structure for 'Sales'
    -- M:1 between Sales and Customers
    -- M:N between Sales and Albums through LineItems
    --
    DROP TABLE IF EXISTS Sales;
    CREATE TABLE Sales (
        salesID int NOT NULL AUTO_INCREMENT UNIQUE,
        customerID int,
        totalCost decimal(10,2) NOT NULL,
        purchaseDate date NOT NULL DEFAULT CURRENT_DATE,
        PRIMARY KEY (salesID),
        FOREIGN KEY (customerID) REFERENCES Customers(customerID)
        ON DELETE SET NULL
    );

    --
    -- Table structure for 'LineItems'
    -- Intersection table for Sales and Albums
    --
    DROP TABLE IF EXISTS LineItems;
    CREATE TABLE LineItems (
        lineItemID int NOT NULL AUTO_INCREMENT UNIQUE,
        quantity int NOT NULL,
        albumPrice decimal(4,2) NOT NULL,
        salesID int,
        albumID int,
        PRIMARY KEY (lineItemID),
        FOREIGN KEY (salesID) REFERENCES Sales(salesID)
        ON DELETE CASCADE,
        FOREIGN KEY (albumID) REFERENCES Albums(albumID)
        ON DELETE NO ACTION
    );

    -- Insert sample data
    
    INSERT INTO Artists(artistID, description) 
        VALUES
            ('Sublime', 'Classic Reggae / Ska-punk band'),
            ('MotleyCrue', 'Classic 80s glam rock band'),
            ('Metallica', 'Classic Metal / Thrash metal band'),
            ('Beatles', '60s Rock n Roll');

    INSERT INTO Genres (genreID, description) 
        VALUES
            ('Rock', 'Classic & Hard Rock'),
            ('Metal', 'Heavy Metal / Thrash Metal / Classic Metal'),
            ('Reggae', 'Reggae / Ska'),
            ('RockNRoll', '50 - 70s Rock and Roll');

    INSERT INTO Albums (albumName, albumPrice, amountInStock, artistID, genreID) 
    VALUES
        ('Sublime', 19.99, 6, 'Sublime', 'Reggae'),
        ('Dr. Feelgood', 21.99, 4, 'MotleyCrue', 'Rock'),
        ('Master of Puppets', 24.99, 5, 'Metallica', 'Metal'),
        ('Abbey Road', 22.50, 7, 'Beatles', 'RockNRoll');

    INSERT INTO Customers (firstName, lastName, phoneNumber, email) 
    VALUES
        ('Jimmy', 'Buffet', '123-321-1234', 'j.buffet@gmail.com'),
        ('Steve', 'Vaughn', '901-801-7012', 's.vaughn@aol.com'),
        ('Alice', 'Johnson', NULL, NULL),
        ('Janice', 'Jackson', '555-666-7777', 'jj@hotmail.com');

    INSERT INTO AlbumRatings (albumRating, albumID, customerID) 
    VALUES
        (4.5,
        (SELECT albumID FROM Albums WHERE albumName = 'Sublime'),
        (SELECT customerID FROM Customers WHERE firstName = 'Jimmy' AND lastName = 'Buffet')),
        (2.5,
        (SELECT albumID FROM Albums WHERE albumName = 'Dr. Feelgood'),
        (SELECT customerID FROM Customers WHERE firstName = 'Steve' AND lastName = 'Vaughn')),
        (1.0,
        (SELECT albumID FROM Albums WHERE albumName = 'Master of Puppets'),
        (SELECT customerID FROM Customers WHERE firstName = 'Jimmy' AND lastName = 'Buffet')),
        (3.7,
        (SELECT albumID FROM Albums WHERE albumName = 'Abbey Road'),
        (SELECT customerID FROM Customers WHERE firstName = 'Alice' AND lastName = 'Johnson'));

    INSERT INTO Sales (customerID, totalCost, purchaseDate) 
    VALUES
        ((SELECT customerID FROM Customers WHERE firstName = 'Jimmy' AND lastName = 'Buffet'),
        42.49, '2025-10-30'),
        ((SELECT customerID FROM Customers WHERE firstName = 'Steve' AND lastName = 'Vaughn'),
        19.99, '2025-10-16'),
        ((SELECT customerID FROM Customers WHERE firstName = 'Alice' AND lastName = 'Johnson'),
        24.99, '2025-10-11');

    INSERT INTO LineItems (quantity, albumPrice, salesID, albumID) 
    VALUES
        (1, 19.99,
        (SELECT salesID FROM Sales
        INNER JOIN Customers ON Sales.customerID = Customers.customerID
        WHERE Customers.firstName = 'Jimmy' AND Customers.lastName = 'Buffet'
        AND Sales.purchaseDate = '2025-10-30'),
        (SELECT albumID FROM Albums WHERE albumName = 'Sublime')),
        (1, 22.50,
        (SELECT salesID FROM Sales
        INNER JOIN Customers ON Sales.customerID = Customers.customerID
        WHERE Customers.firstName = 'Jimmy' AND Customers.lastName = 'Buffet'
        AND Sales.purchaseDate = '2025-10-30'),
        (SELECT albumID FROM Albums WHERE albumName = 'Abbey Road')),
        (1, 19.99,
        (SELECT salesID FROM Sales
        INNER JOIN Customers ON Sales.customerID = Customers.customerID
        WHERE Customers.firstName = 'Steve' AND Customers.lastName = 'Vaughn'
        AND Sales.purchaseDate = '2025-10-16'),
        (SELECT albumID FROM Albums WHERE albumName = 'Sublime')),
        (1, 24.99,
        (SELECT salesID FROM Sales
        INNER JOIN Customers ON Sales.customerID = Customers.customerID
        WHERE Customers.firstName = 'Alice' AND Customers.lastName = 'Johnson'
        AND Sales.purchaseDate = '2025-10-11'),
        (SELECT albumID FROM Albums WHERE albumName = 'Master of Puppets'));

    -- Untidying up the place
    SET FOREIGN_KEY_CHECKS=1;
    
END //

DELIMITER;

-- ================================================================
-- SALES STORED PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_UpdateSale;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateSale`(
    IN p_salesID INT,
    IN p_customerFullName VARCHAR(100),
    IN p_totalCost DECIMAL(10,2),
    IN p_purchaseDate DATE
)
BEGIN
    DECLARE v_customerID INT DEFAULT NULL;
    DECLARE v_firstName VARCHAR(45);
    DECLARE v_lastName VARCHAR(45);
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Allow NULL customer (empty or '<customer deleted>')
        IF p_customerFullName IS NOT NULL 
           AND p_customerFullName != '' 
           AND p_customerFullName != '<customer deleted>' THEN
            
            -- Parse the full name into firstName and lastName
            SET v_firstName = SUBSTRING_INDEX(p_customerFullName, ' ', 1);
            SET v_lastName = SUBSTRING_INDEX(p_customerFullName, ' ', -1);
            
            -- Lookup customerID from firstName and lastName
            SELECT customerID INTO v_customerID
            FROM Customers
            WHERE firstName = v_firstName AND lastName = v_lastName
            LIMIT 1;
            
            IF v_customerID IS NULL THEN
                SET error_message = CONCAT('Customer not found: ', p_customerFullName);
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
            END IF;
        END IF;
        
        -- Update the sale (customerID can be NULL)
        UPDATE Sales
        SET customerID = v_customerID,
            totalCost = p_totalCost,
            purchaseDate = p_purchaseDate
        WHERE salesID = p_salesID;
        
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching sale found for ID: ', p_salesID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
    COMMIT;
END //

DELIMITER;

-- ================================================================
-- ALBUMRATINGS STORED PROCEDURES (M:N between Albums and Customers)
-- ================================================================

DROP PROCEDURE IF EXISTS sp_CreateAlbumRating;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateAlbumRating`(
    IN p_albumName VARCHAR(100),
    IN p_firstName VARCHAR(45),
    IN p_lastName VARCHAR(45),
    IN p_albumRating DECIMAL(2,1),
    OUT p_newID INT
)
BEGIN
    DECLARE v_albumID INT;
    DECLARE v_customerID INT;
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Lookup albumID from albumName
        SELECT albumID INTO v_albumID
        FROM Albums
        WHERE albumName = p_albumName
        LIMIT 1;
        
        IF v_albumID IS NULL THEN
            SET error_message = CONCAT('Album not found: ', p_albumName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Lookup customerID from first and last name
        SELECT customerID INTO v_customerID
        FROM Customers
        WHERE firstName = p_firstName AND lastName = p_lastName
        LIMIT 1;
        
        IF v_customerID IS NULL THEN
            SET error_message = CONCAT('Customer not found: ', p_firstName, ' ', p_lastName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Insert the rating
        INSERT INTO AlbumRatings (albumID, customerID, albumRating)
        VALUES (v_albumID, v_customerID, p_albumRating);
        
        SET p_newID = LAST_INSERT_ID();
        SELECT LAST_INSERT_ID() AS 'new_albumRatingID';
        
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_UpdateAlbumRating;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateAlbumRating`(
    IN p_albumRatingID INT,
    IN p_albumName VARCHAR(100),
    IN p_customerFullName VARCHAR(100),
    IN p_albumRating DECIMAL(2,1)
)
BEGIN
    DECLARE v_albumID INT;
    DECLARE v_customerID INT;
    DECLARE v_firstName VARCHAR(45);
    DECLARE v_lastName VARCHAR(45);
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Parse customer full name into first and last
        SET v_firstName = SUBSTRING_INDEX(p_customerFullName, ' ', 1);
        SET v_lastName = SUBSTRING_INDEX(p_customerFullName, ' ', -1);
        
        -- Lookup albumID from albumName
        SELECT albumID INTO v_albumID
        FROM Albums
        WHERE albumName = p_albumName
        LIMIT 1;
        
        IF v_albumID IS NULL THEN
            SET error_message = CONCAT('Album not found: ', p_albumName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Lookup customerID from parsed name
        SELECT customerID INTO v_customerID
        FROM Customers
        WHERE firstName = v_firstName AND lastName = v_lastName
        LIMIT 1;
        
        IF v_customerID IS NULL THEN
            SET error_message = CONCAT('Customer not found: ', p_customerFullName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Update the rating
        UPDATE AlbumRatings
        SET albumRating = p_albumRating,
            albumID = v_albumID,
            customerID = v_customerID
        WHERE albumRatingID = p_albumRatingID;
        
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching album rating found for ID: ', p_albumRatingID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_DeleteAlbumRating;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_DeleteAlbumRating`(
    IN p_albumRatingID INT
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        DELETE FROM AlbumRatings WHERE albumRatingID = p_albumRatingID;
        
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching album rating found for ID: ', p_albumRatingID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
    COMMIT;
END //

DELIMITER;

-- ================================================================
-- ARTISTS STORED PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_CreateArtist;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateArtist`(
    IN p_artistID VARCHAR(50),
    IN p_description VARCHAR(255)
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Artists (artistID, description)
        VALUES (p_artistID, p_description);
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_UpdateArtist;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateArtist`(
    IN p_artistID VARCHAR(50),
    IN p_description VARCHAR(255)
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Artists
        SET description = p_description
        WHERE artistID = p_artistID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching artist found for ID: ', p_artistID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_DeleteArtist;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_DeleteArtist`(
    IN p_artistID VARCHAR(50)
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Artists WHERE artistID = p_artistID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching artist found for ID: ', p_artistID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

-- ================================================================
-- CUSTOMERS STORED PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_CreateCustomer;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateCustomer`(
    IN p_firstName VARCHAR(45),
    IN p_lastName VARCHAR(45),
    IN p_phoneNumber VARCHAR(15),
    IN p_email VARCHAR(50),
    OUT p_newID INT
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Customers (firstName, lastName, phoneNumber, email)
        VALUES (p_firstName, p_lastName, p_phoneNumber, p_email);

        SET p_newID = LAST_INSERT_ID();
        SELECT LAST_INSERT_ID() AS 'new_customerID';
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_UpdateCustomer;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateCustomer`(
    IN p_customerID INT,
    IN p_firstName VARCHAR(45),
    IN p_lastName VARCHAR(45),
    IN p_phoneNumber VARCHAR(15),
    IN p_email VARCHAR(50)
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Customers
        SET firstName = p_firstName,
            lastName = p_lastName,
            phoneNumber = p_phoneNumber,
            email = p_email
        WHERE customerID = p_customerID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching customer found for ID: ', p_customerID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_DeleteCustomer;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_DeleteCustomer`(
    IN p_customerID INT
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Customers WHERE customerID = p_customerID;

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching customer found for ID: ', p_customerID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END //

DELIMITER;

-- ================================================================
-- LINEITEMS STORED PROCEDURES (M:N between Sales and Albums)
-- ================================================================

DROP PROCEDURE IF EXISTS sp_CreateLineItem;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateLineItem`(
    IN p_salesID INT,
    IN p_albumName VARCHAR(100),
    IN p_albumPrice DECIMAL(4,2),
    IN p_quantity INT,
    OUT p_newID INT
)
BEGIN
    DECLARE v_albumID INT;
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Lookup albumID from albumName
        SELECT albumID INTO v_albumID
        FROM Albums
        WHERE albumName = p_albumName
        LIMIT 1;
        
        IF v_albumID IS NULL THEN
            SET error_message = CONCAT('Album not found: ', p_albumName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Insert the line item
        INSERT INTO LineItems (salesID, albumID, albumPrice, quantity)
        VALUES (p_salesID, v_albumID, p_albumPrice, p_quantity);
        
        SET p_newID = LAST_INSERT_ID();
        SELECT LAST_INSERT_ID() AS 'new_lineItemID';
        
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_UpdateLineItem;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_UpdateLineItem`(
    IN p_lineItemID INT,
    IN p_albumName VARCHAR(100),
    IN p_albumPrice DECIMAL(4,2),
    IN p_quantity INT
)
BEGIN
    DECLARE v_albumID INT;
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Lookup albumID from albumName
        SELECT albumID INTO v_albumID
        FROM Albums
        WHERE albumName = p_albumName
        LIMIT 1;
        
        IF v_albumID IS NULL THEN
            SET error_message = CONCAT('Album not found: ', p_albumName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Update the line item
        UPDATE LineItems
        SET albumID = v_albumID,
            albumPrice = p_albumPrice,
            quantity = p_quantity
        WHERE lineItemID = p_lineItemID;
        
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching line item found for ID: ', p_lineItemID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
    COMMIT;
END //

DELIMITER;

DROP PROCEDURE IF EXISTS sp_DeleteLineItem;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_DeleteLineItem`(
    IN p_lineItemID INT
)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        DELETE FROM LineItems WHERE lineItemID = p_lineItemID;
        
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching line item found for ID: ', p_lineItemID);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
    COMMIT;
END //

DELIMITER;

-- sp_CreateSale (part of SALES STORED PROCEDURES section above)
DROP PROCEDURE IF EXISTS sp_CreateSale;

DELIMITER / /

CREATE DEFINER=`cs340_richtcal`@`%` PROCEDURE `sp_CreateSale`(
    IN p_firstName VARCHAR(45),
    IN p_lastName VARCHAR(45),
    IN p_purchaseDate DATE,
    IN p_lineItemsJSON JSON,
    OUT p_newSalesID INT
)
BEGIN
    DECLARE v_customerID INT;
    DECLARE v_totalCost DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_albumID INT;
    DECLARE v_albumPrice DECIMAL(4,2);
    DECLARE v_quantity INT;
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_lineItemCount INT;
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        
        -- Lookup customerID from first and last name
        SELECT customerID INTO v_customerID
        FROM Customers
        WHERE firstName = p_firstName AND lastName = p_lastName
        LIMIT 1;
        
        -- If customer not found, raise error
        IF v_customerID IS NULL THEN
            SET error_message = CONCAT('No customer found with name: ', p_firstName, ' ', p_lastName);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
        
        -- Calculate total cost from line items JSON
        SET v_lineItemCount = JSON_LENGTH(p_lineItemsJSON);
        
        IF v_lineItemCount = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'At least one line item is required';
        END IF;
        
        -- Loop through line items to calculate total
        WHILE v_index < v_lineItemCount DO
            SET v_quantity = JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].quantity'));
            SET v_albumPrice = JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].albumPrice'));
            SET v_totalCost = v_totalCost + (v_quantity * v_albumPrice);
            SET v_index = v_index + 1;
        END WHILE;
        
        -- Insert the sale
        INSERT INTO Sales (customerID, totalCost, purchaseDate)
        VALUES (v_customerID, v_totalCost, p_purchaseDate);
        
        -- Get the new salesID
        SET p_newSalesID = LAST_INSERT_ID();
        
        -- Reset index for line items insertion
        SET v_index = 0;
        
        -- Insert each line item
        WHILE v_index < v_lineItemCount DO
            -- Get albumID from albumName
            SELECT albumID INTO v_albumID
            FROM Albums
            WHERE albumName = JSON_UNQUOTE(JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].albumName')))
            LIMIT 1;
            
            IF v_albumID IS NULL THEN
                SET error_message = CONCAT('Album not found: ', JSON_UNQUOTE(JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].albumName'))));
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
            END IF;
            
            SET v_quantity = JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].quantity'));
            SET v_albumPrice = JSON_EXTRACT(p_lineItemsJSON, CONCAT('$[', v_index, '].albumPrice'));
            
            -- Insert line item
            INSERT INTO LineItems (salesID, albumID, albumPrice, quantity)
            VALUES (p_newSalesID, v_albumID, v_albumPrice, v_quantity);
            
            SET v_index = v_index + 1;
        END WHILE;
        
        -- Return the new salesID
        SELECT p_newSalesID AS new_salesID;
        
    COMMIT;
END //

DELIMITER;