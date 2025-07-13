CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    First_name VARCHAR(30) NOT NULL,
    Middle_name VARCHAR(30),
    Last_name VARCHAR(30) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Password_hash VARCHAR(80) NOT NULL,
    Created_at TIMESTAMP DEFAULT NOW(),
    Updated_at TIMESTAMP DEFAULT NOW(),
   UNIQUE (Email) 
);

 CREATE TABLE Roles (
    User_ID INT,
    Role VARCHAR(10) CHECK(Role IN ('Admin', 'Tenant', 'Staff')) NOT NULL,
    PRIMARY KEY (User_ID, Role),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

CREATE TABLE Admins (
    User_ID INT PRIMARY KEY,
    UPI_ID VARCHAR(60),
    Account_no VARCHAR(20) NOT NULL,
    IFSC_code VARCHAR(20) NOT NULL,
    Bank_name VARCHAR(100) NOT NULL,
    Bank_Branch VARCHAR(100),
    Account_holder_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

CREATE TABLE Staff (
    User_ID INT PRIMARY KEY,
    Service VARCHAR(15) CHECK(Service IN ('Plumbing', 'Electrical', 'Carpentry', 'Pest Control')) NOT NULL,
    Account_no VARCHAR(20) NOT NULL,
    IFSC_code VARCHAR(20) NOT NULL,
    Bank_name VARCHAR(100) NOT NULL,
    Bank_Branch VARCHAR(100),
    Account_holder_name VARCHAR(100) NOT NULL,
    UPI_ID VARCHAR(60),
    Availability BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);


CREATE TABLE COUNTRY_STATE (
    State VARCHAR(100) PRIMARY KEY,
    Country VARCHAR(100) NOT NULL);

CREATE TABLE CITY_STATE (
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    PRIMARY KEY (City, State),
    FOREIGN KEY (State) REFERENCES COUNTRY_STATE(State) ON DELETE CASCADE);

CREATE TABLE ZIP_CITY (
    Zip_code VARCHAR(10) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    PRIMARY KEY (Zip_code, Country),
    FOREIGN KEY (City, State) REFERENCES CITY_STATE(City, State) ON DELETE CASCADE);


CREATE TABLE Property (
    Property_ID SERIAL PRIMARY KEY,
    Owner_ID INT NOT NULL,
    Zip_code VARCHAR(10) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    Date_of_construction DATE,
    Create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Door_no VARCHAR(50),
    Building_name VARCHAR(100),
    Street_name VARCHAR(100),
    Area VARCHAR(100),
    Type VARCHAR(20) CHECK(Type IN ('Commercial Building', 'Residential Building', 'Land')),
    Area_in_sqft FLOAT,
    Facing VARCHAR(15) CHECK(Facing IN ('North', 'West', 'East', 'South', 'North-East', 'North-West', 'South-East', 'South-West')),
    Availability VARCHAR(20) CHECK(Availability IN ('Available', 'Leased', 'Under maintenance', 'Sold')),
    Past_tenant_count INT DEFAULT 0,
    Description VARCHAR(500),
    FOREIGN KEY (Owner_ID) REFERENCES Admins(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Zip_code, Country) REFERENCES ZIP_CITY(Zip_code, Country) ON DELETE CASCADE
);
CREATE TABLE Photos (
    Photo_ID SERIAL PRIMARY KEY,
    Property_ID INT NOT NULL,
    File_name VARCHAR(200) NOT NULL UNIQUE,
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE
);
CREATE TABLE Plot_lands (
    Property_ID INT,
    Type VARCHAR(11) CHECK(Type IN ('commercial', 'Residential')),
    Boundary_wall VARCHAR(10) CHECK(Boundary_wall IN ('Yes', 'No')),
    Sale_type VARCHAR(10) CHECK(Sale_type IN ('Rent', 'Buy')),
    Price_per_sqft DECIMAL(10, 2),
    Advance_Amount DECIMAL(10, 2),
    Negotiability VARCHAR(10) CHECK(Negotiability IN ('Yes', 'No')),
    PRIMARY KEY (Property_ID, Sale_type),
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE,
    CONSTRAINT Check_rental_residential CHECK(NOT(Sale_type = 'Rent' AND Type = 'Residential'))
);
CREATE TABLE Residential_buildings (
    Property_ID INT,
    Sale_type VARCHAR(4) CHECK(Sale_type IN ('Rent', 'Buy')),
    PRIMARY KEY (Property_ID, Sale_type),
    Type VARCHAR(20) CHECK(Type IN ('Apartment/flat', 'Independent house/Villa', 'Gated community villa', 'Hostel', 'PGs')),
    BHK_Type VARCHAR(2) CHECK(BHK_Type IN ('1', '2', '3', '4', '5')),
    Furnishing VARCHAR(15) CHECK(Furnishing IN ('Fully furnished', 'Semi furnished', 'Unfurnished')),
    Price DECIMAL(10, 2),
    Advance_amount DECIMAL(10, 2),
    Negotiability VARCHAR(3) CHECK(Negotiability IN ('Yes', 'No')),
    Two_wheeler_parking VARCHAR(3) CHECK(Two_wheeler_parking IN ('Yes', 'No')),
    Four_wheeler_parking VARCHAR(3) CHECK(Four_wheeler_parking IN ('Yes', 'No')),
    Bathrooms INT,
    Floor INT,
    Lift_service VARCHAR(3) CHECK(Lift_service IN ('Yes', 'No')),
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE
);
CREATE TABLE Commercial_buildings (
    Property_ID INT,
    Sale_type VARCHAR(4) CHECK(Sale_type IN ('Rent', 'Buy')),
    PRIMARY KEY (Property_ID, Sale_type),
    Type VARCHAR(15) CHECK(Type IN ('Office space', 'Warehouse', 'Retail shop')),
    Parking VARCHAR(10) CHECK(Parking IN ('Public', 'Reserved')),
    Furnishing VARCHAR(15) CHECK(Furnishing IN ('Fully furnished', 'Semi furnished', 'Unfurnished')),
    Price DECIMAL(10, 2),
    Advance_amount DECIMAL(10, 2),
    Negotiability VARCHAR(3) CHECK(Negotiability IN ('Yes', 'No')),
    Start_floor INT,
    End_floor INT,
    Lift_service VARCHAR(3) CHECK(Lift_service IN ('Yes', 'No')),
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE
);

CREATE TABLE Lease_Agreement (
    Lease_ID SERIAL PRIMARY KEY,
    Property_ID INT NOT NULL,
    Tenant_ID INT NOT NULL,
    Start_date DATE NOT NULL,
    End_date DATE NOT NULL,
    Renewed VARCHAR(3) CHECK(Renewed IN ('YES', 'NO')),
    Price DECIMAL(10, 2) NOT NULL,
    Advance_amount DECIMAL(10, 2),
    Status VARCHAR(10) CHECK(Status IN ('active', 'expired', 'terminated')) NOT NULL,
    Created_at TIMESTAMP DEFAULT NOW(),
    Updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE,
    FOREIGN KEY (Tenant_ID) REFERENCES Users(User_ID) ON DELETE CASCADE);

CREATE TABLE Sale_Agreement (
    Sale_ID SERIAL PRIMARY KEY,
    Property_ID INT NOT NULL,
    Tenant_ID INT NOT NULL,
    Date DATE NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Advance_amount DECIMAL(10, 2),
    Created_at TIMESTAMP DEFAULT NOW(),
    Updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE,
  FOREIGN KEY (Tenant_ID) REFERENCES Users(User_ID) ON DELETE CASCADE);

 CREATE TABLE Lease_Payment (
    Payment_ID SERIAL PRIMARY KEY,
    Lease_ID INT NOT NULL,
    Date TIMESTAMP NOT NULL DEFAULT NOW(),
    Amount DECIMAL(10, 2) NOT NULL,
    Mode VARCHAR(10) CHECK(Mode IN ('credit', 'debit', 'online', 'cash/cheque')) NOT NULL,
    Transaction_ID VARCHAR(50),
    Advance VARCHAR(3) CHECK(Advance IN ('NO', 'YES')) DEFAULT 'NO',
    Status VARCHAR(15) CHECK(Status IN ('pending', 'completed', 'payment_failed')) NOT NULL,
    FOREIGN KEY (Lease_ID) REFERENCES Lease_Agreement(Lease_ID) ON DELETE CASCADE
);

 CREATE TABLE Sale_Payment (
    Payment_ID SERIAL PRIMARY KEY,
    Sale_ID INT NOT NULL,
    Date TIMESTAMP NOT NULL DEFAULT NOW(),
    Amount DECIMAL(10, 2) NOT NULL,
    Mode VARCHAR(10) CHECK(Mode IN ('credit', 'debit', 'online', 'cash/cheque')) NOT NULL,
    Transaction_ID VARCHAR(50),
    Advance VARCHAR(3) CHECK(Advance IN ('NO', 'YES')) DEFAULT 'NO',
    Status VARCHAR(15) CHECK(Status IN ('pending', 'completed', 'payment_failed')) NOT NULL,
    FOREIGN KEY (Sale_ID) REFERENCES Sale_Agreement(Sale_ID) ON DELETE CASCADE
);

 CREATE TABLE Maintenance (
    Request_ID SERIAL PRIMARY KEY,
    Lease_ID INT NOT NULL,
    Staff_ID INT,
    Service VARCHAR(15) CHECK(Service IN ('Plumbing', 'Electrical', 'Carpentry', 'Pest Control')) NOT NULL,
    Description VARCHAR(300),
    Status VARCHAR(10) CHECK(Status IN ('Pending', 'Assigned', 'Resolved', 'In progress', 'cancelled')) NOT NULL DEFAULT 'Pending',
    Created_at TIMESTAMP DEFAULT NOW(),
    Updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (Lease_ID) REFERENCES Lease_Agreement(Lease_ID) ON DELETE CASCADE,
    FOREIGN KEY (Staff_ID) REFERENCES Staff(User_ID) ON DELETE CASCADE
);

CREATE TABLE Maintenance_Payment (
    Payment_ID SERIAL PRIMARY KEY,
    Request_ID INT NOT NULL,
    Date TIMESTAMP NOT NULL DEFAULT NOW(),
    Amount DECIMAL(10, 2) NOT NULL,
    Mode VARCHAR(10) CHECK(Mode IN ('credit', 'debit', 'online', 'cash/cheque')) NOT NULL,
    Transaction_ID VARCHAR(50),
    Status VARCHAR(15) CHECK(Status IN ('pending', 'completed', 'payment_failed')) NOT NULL,
    FOREIGN KEY (Request_ID) REFERENCES Maintenance(Request_ID) ON DELETE CASCADE
);

 CREATE TABLE Enquiry (
    Enquiry_ID SERIAL PRIMARY KEY,
    Tenant_ID INT NOT NULL,
    Property_ID INT NOT NULL,
    Description VARCHAR(300),
    Approval VARCHAR(10) CHECK(Approval IN ('Approved', 'Pending', 'Declined')) DEFAULT 'Pending',
    FOREIGN KEY (Tenant_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Property_ID) REFERENCES Property(Property_ID) ON DELETE CASCADE
);
