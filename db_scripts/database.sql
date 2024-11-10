DROP DATABASE IF EXISTS cs461_foodtruck;
CREATE DATABASE cs461_foodtruck;
\c cs461_tournament_db;

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

CREATE TABLE Users {
    userId SERIAL PRIMARY KEY,
    passwordHash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    usertoken VARCHAR(255) UNIQUE
}

CREATE TABLE Foodtruck {
    truckId SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(15) UNIQUE,
    truckname VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(100),
    description VARCHAR(255),
    externalLink VARCHAR(255),
}

CREATE TABLE Favorites {
    favoriteId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId),
    FOREIGN KEY (userId) REFERENCES Users (userId)
}

CREATE TABLE MenuItem {
    itemId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    itemPrice FLOAT,
    foodName VARCHAR(20) NOT NULL,
    dietaryRestriction INT NOT NULL,
    FOREIGN KEY (dietaryRestriction) REFERENCES DietaryRestrictions (restrictionId)
}

CREATE TABLE Reviews {
    reviewId SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    comment VARCHAR(255),
}

CREATE TABLE OpeningHours {
    openHourEntryID SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    dayOfWeek VARCHAR(9) NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId)
}

CREATE TABLE DietaryRestrictions {
    restrictionId SERIAL PRIMARY KEY,
    allergySource VARCHAR(255),
    spicyLevel INT NOT NULL,
    halal BOOLEAN DEFAULT FALSE,
    vegetarian BOOLEAN DEFAULT FALSE,
    vegan BOOLEAN DEFAULT FALSE,
} 

-- Probably not going to end up having users upload photos
CREATE TABLE Photos {
    photoId SERIAL PRIMARY KEY,
    truckId INT NOT NULL,
    photoSrc BLOB,
    userID INT NOT NULL,
    FOREIGN KEY (truckId) REFERENCES Foodtruck (truckId),
}

