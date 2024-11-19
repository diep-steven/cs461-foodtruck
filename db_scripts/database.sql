DROP DATABASE IF EXISTS cs461_foodtruck;
CREATE DATABASE cs461_foodtruck;
\c cs461_foodtruck;

-- Clean out the database.
DO $$
    DECLARE
        drop_query TEXT;
    BEGIN
        SELECT string_agg(format('DROP TABLE IF EXISTS %I.%I CASCADE;', schemaname, tablename), ' ')
        INTO drop_query
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema');

        IF drop_query IS NOT NULL THEN
            EXECUTE drop_query;
        END IF;
    END $$;

CREATE TABLE Users (
    userId SERIAL PRIMARY KEY,
    passwordHash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    usertoken VARCHAR(255) UNIQUE
);

CREATE TABLE Foodtruck (
    truckId SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(15) UNIQUE,
    truckname VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(100),
    description VARCHAR(255),
    externalLink VARCHAR(255)
);

CREATE TABLE Favorites (
    favoriteId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId),
    FOREIGN KEY (userId) REFERENCES Users (userId)
);

CREATE TABLE DietaryRestrictions (
    restrictionId SERIAL PRIMARY KEY,
    allergySource VARCHAR(255),
    spicyLevel INT DEFAULT 0,
    halal BOOLEAN DEFAULT FALSE,
    vegetarian BOOLEAN DEFAULT FALSE,
    vegan BOOLEAN DEFAULT FALSE
);

CREATE TABLE MenuItem (
    itemId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    itemPrice FLOAT,
    foodName VARCHAR(50) NOT NULL,
    dietaryRestrictionId INT NOT NULL,
    FOREIGN KEY (dietaryRestrictionId) REFERENCES DietaryRestrictions (restrictionId)
);

CREATE TABLE Reviews (
    reviewId SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    truckId INT NOT NULL,
    comment VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Users (userId),
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId)
);

CREATE TABLE OpeningHours (
    openHourEntryID SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    dayOfWeek VARCHAR(9) NOT NULL,
    startTime TIME,
    endTime TIME,
    isClosed BOOLEAN,
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId)
);

-- Probably not going to end up having users upload photos
CREATE TABLE Photos (
    photoId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    photoSrc VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId)
);

--Sample data
INSERT INTO Foodtruck(truckName, phoneNumber, address, description, externalLink)
VALUES ('Cucina Zapata', NULL, '3101 Ludlow St, Philadelphia, PA 19104', 'Asian and Mexican fusion dishes that combine bold and exciting flavors with modern comfort foods.', 'https://www.facebook.com/cucina.zapata/'),
('Philly Halal', '12154334822', '3300 Market St, Philadelphia, PA 19104', 'Orange Halal Truck', NULL),
('Nafi Food Express', '12673345830', '3400 Market St, Philadelphia, PA 19104', 'Indian' , 'http://places.singleplatform.com/nafi-indian-food-express/menu?ref=google'),
('The Jimmy Truck' , '12152808102', '3101-3141 Ludlow St, Philadelphia, PA 19104' , 'Sandwich truck' , 'https://places.singleplatform.com/the-jimmy-truck/menu?ref=google'),
( 'La Sarten Express Food', '12152530162', '1613 S 7th St, Philadelphia, PA 19148', 'Mexican', 'http://ordermexicanfoodtrucklasarten.com/'),
('Kim''s Dragon Asian Food', NULL, '3101-3141 Ludlow St, Philadelphia, PA 19104', 'Asian', NULL),
('Sue''s Lunch Truck', NULL, 'Curtis Hall, 3141 Ludlow St, Philadelphia, PA 19104', NULL, NULL),
('KC''s Fresh Fruit and Smoothies', '6103298294', '23-30 N 33rd St, Philadelphia, PA 19104','Smoothie Truck. Will be closed from 11/23/2024 until Spring', 'https://www.facebook.com/kcsfreshfruitandsmoothies/'),
('Dos Hermanos Taco', '12676068356', '3397 3342, 3366 Market St, Philadelphia, PA 19104', 'Mexican', 'http://www.doshermanostacos.com/'),
('Pete''s Little Lunch Box', '2156051228','23 N 33rd St, Philadelphia, PA 19104','American','https://www.yelp.com/biz/petes-little-lunch-box-philadelphia');

INSERT INTO DietaryRestrictions(allergySource, spicyLevel, halal, vegetarian, vegan)
VALUES
('Fish',1,TRUE,FALSE, FALSE),
('',1,TRUE,FALSE, FALSE),
('Fish',1,TRUE,FALSE, FALSE),
('',0,TRUE,FALSE, FALSE),
('Fish',0,TRUE,FALSE, FALSE),
('',2,TRUE,FALSE, FALSE),
('',2,FALSE,FALSE, FALSE),
('',2,FALSE,FALSE, FALSE),
('',2,FALSE,TRUE, FALSE),
('',0,FALSE,FALSE, FALSE),
('',1,FALSE,FALSE, FALSE),
('',2,FALSE,FALSE, FALSE),
('',2,FALSE,FALSE, FALSE),
('',1,FALSE,FALSE, FALSE),
('',1,FALSE,FALSE, FALSE),
('',0,FALSE,FALSE, FALSE),
('',1,FALSE,TRUE, TRUE),
('Shrimp',0,FALSE,FALSE, FALSE),
('',0,FALSE,FALSE, FALSE),
('',0,FALSE,FALSE, FALSE),
('',1,FALSE,FALSE, FALSE),
('',0,FALSE,TRUE, FALSE),
('Strawberry',0,FALSE,TRUE, FALSE),
('Banana',0,FALSE,TRUE, FALSE),
('Lobster',1,FALSE,FALSE, FALSE),
('',1,FALSE,FALSE, FALSE),
('Egg',0,FALSE,FALSE, FALSE),
('',0,TRUE,TRUE, TRUE),
('Mushroom',0,FALSE,FALSE, FALSE),
('',0,TRUE,TRUE, TRUE);

INSERT INTO MenuItem(truckId, itemPrice, foodName, dietaryRestrictionId)
VALUES
(1,10,'CAp’n Crunch Fish Platter',1),
(1,10,'Chicken Katsu Platter',2),
(1,9,'Cap’n Crunch Fish Tacos 2',3),
(2,10,'Chicken over rice',4),
(2,10,'Fish over rice',5),
(2,10,'Lamb over rice',6),
(3,10.5,'Chicken Tikka Masala',7),
(3,10.5,'Chicken Biryani',8),
(3,10.5,'Mattar Paneer',9),
(4,8,'Super Jimmy',10),
(4,8,'Fat Cat Chicken',11),
(4,6,'Cheese Steak Platter Beef or Chicken',12),
(5,12,'Steak Burrito',13),
(5,13,'Tacos de Cabeza',14),
(5,15,'Tacos de Tripa',15),
(6,7,'Beef Chow FUN',16),
(6,5,'Vegetable Lo Mein',17),
(6,12,'Shrimp fried rice',18),
(7,12,'Cheesesteaks',19),
(7,10,'Hoagie',20),
(7,11,'Meatball Sandwich',21),
(8,8,'Tropical Smoothie',22),
(8,8,'Strawberry Mango Smoothie',23),
(8,7,'Banana Smoothie',24),
(9,16,'Lobster Quesadilla',25),
(9,14,'Mexican Torta',26),
(9,12,'Breakfast Burrito',27),
(10,3,'Iced Coffee (S)',28),
(10,10,'Mushroom Cheese Steak',29),
(10,5,'Bagel',30);

INSERT INTO OpeningHours(truckId, dayOfWeek, startTime, endTime, isClosed)
VALUES
(1, 'Sunday', NULL, NULL, TRUE),
(1, 'Monday', '12:00', '18:00', FALSE),
(1, 'Tuesday', '12:00', '18:00', FALSE),
(1, 'Wednesday', '12:00', '18:00', FALSE),
(1, 'Thursday', '12:00', '18:00', FALSE),
(1, 'Friday', '12:00', '17:00', FALSE),
(1, 'Saturday', NULL, NULL, TRUE),
(2, 'Sunday', '10:00', '22:00', FALSE),
(2, 'Monday', '10:00', '22:00', FALSE),
(2, 'Tuesday', '10:00', '22:00', FALSE),
(2, 'Wednesday', '10:00', '22:00', FALSE),
(2, 'Thursday', '10:00', '22:00', FALSE),
(2, 'Friday', '10:00', '22:00', FALSE),
(2, 'Saturday', '10:00', '22:00', FALSE),
(3, 'Sunday', NULL, NULL, TRUE),
(3, 'Monday', '10:00', '18:00', FALSE),
(3, 'Tuesday', '10:00', '18:00', FALSE),
(3, 'Wednesday', '10:00', '18:00', FALSE),
(3, 'Thursday', '10:00', '18:00', FALSE),
(3, 'Friday', '10:00', '18:00', FALSE),
(3, 'Saturday', NULL, NULL, TRUE),
(4, 'Sunday', NULL, NULL, TRUE),
(4, 'Monday', '11:00', '18:00', FALSE),
(4, 'Tuesday', '11:00', '18:00', FALSE),
(4, 'Wednesday', '11:00', '18:00', FALSE),
(4, 'Thursday', '11:00', '18:00', FALSE),
(4, 'Friday', '11:00', '18:00', FALSE),
(4, 'Saturday', NULL, NULL, TRUE),
(5, 'Sunday', '04:00', '16:00', FALSE),
(5, 'Monday', '04:00', '16:00', FALSE),
(5, 'Tuesday', '04:00', '16:00', FALSE),
(5, 'Wednesday', '04:00', '16:00', FALSE),
(5, 'Thursday', '04:00', '16:00', FALSE),
(5, 'Friday', '04:00', '16:00', FALSE),
(5, 'Saturday', NULL, NULL, TRUE),
(6, 'Sunday', '09:00', '18:00', FALSE),
(6, 'Monday', '09:00', '18:00', FALSE),
(6, 'Tuesday', '09:00', '18:00', FALSE),
(6, 'Wednesday', '09:00', '18:00', FALSE),
(6, 'Thursday', '09:00', '18:00', FALSE),
(6, 'Friday', '09:00', '18:00', FALSE),
(6, 'Saturday', NULL, NULL, TRUE),
(7, 'Sunday', '09:00', '18:00', FALSE),
(7, 'Monday', '09:00', '18:00', FALSE),
(7, 'Tuesday', '09:00', '18:00', FALSE),
(7, 'Wednesday', '09:00', '18:00', FALSE),
(7, 'Thursday', '09:00', '18:00', FALSE),
(7, 'Friday', '09:00', '18:00', FALSE),
(7, 'Saturday', '09:00', '18:00', FALSE),
(8, 'Sunday', NULL, NULL, TRUE),
(8, 'Monday', '08:00', '16:00', FALSE),
(8, 'Tuesday', '08:00', '16:00', FALSE),
(8, 'Wednesday', '08:00', '16:00', FALSE),
(8, 'Thursday', '08:00', '16:00', FALSE),
(8, 'Friday', '08:00', '16:00', FALSE),
(8, 'Saturday', NULL, NULL, TRUE),
(9, 'Sunday', NULL, NULL, TRUE),
(9, 'Monday', '10:00', '14:30', FALSE),
(9, 'Tuesday', '10:00', '14:30', FALSE),
(9, 'Wednesday', '10:00', '14:30', FALSE),
(9, 'Thursday', '10:00', '14:30', FALSE),
(9, 'Friday', '10:00', '14:30', FALSE),
(9, 'Saturday', NULL, NULL, TRUE),
(10, 'Sunday', '06:00', '16:00', FALSE),
(10, 'Monday', '06:00', '16:00', FALSE),
(10, 'Tuesday', '06:00', '16:00', FALSE),
(10, 'Wednesday', '06:00', '16:00', FALSE),
(10, 'Thursday', '06:00', '16:00', FALSE),
(10, 'Friday', '06:00', '16:00', FALSE),
(10, 'Saturday', '06:00', '16:00', FALSE);
