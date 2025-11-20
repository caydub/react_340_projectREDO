DROP PROCEDURE sp_CreateAlbum;
DELIMITER //
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
DELIMITER ;

DROP PROCEDURE sp_DeleteAlbum;
DELIMITER //
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
DELIMITER ;

DROP PROCEDURE sp_UpdateAlbum;
DELIMITER //
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
DELIMITER ;

DROP PROCEDURE sp_reset_sample_data;
DELIMITER //
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
        ON DELETE NO ACTION,
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
DELIMITER ;