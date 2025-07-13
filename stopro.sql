CREATE OR REPLACE FUNCTION insert_property(
    input_Owner_ID INT,
    input_Zip_code VARCHAR(10),
    input_Country VARCHAR(100),
    input_State VARCHAR(100),
    input_City VARCHAR(100),
    input_Date_of_construction DATE,
    input_Create_at TIMESTAMP,
    input_Update_at TIMESTAMP,
    input_Door_no VARCHAR(50),
    input_Building_name VARCHAR(100),
    input_Street_name VARCHAR(100),
    input_Area VARCHAR(100),
    input_Type VARCHAR(20),
    input_Area_in_sqft FLOAT,
    input_Facing VARCHAR(15),
    input_Description VARCHAR(500)
)
RETURNS INT AS $$
DECLARE
    new_property_id INT;
BEGIN
    -- Insert into COUNTRY_STATE if not already present
    INSERT INTO COUNTRY_STATE(State, Country) 
    VALUES (input_State, input_Country)
    ON CONFLICT (State) DO NOTHING;

    -- Insert into CITY_STATE if not already present
    INSERT INTO CITY_STATE(City, State)
    VALUES (input_City, input_State)
    ON CONFLICT (City, State) DO NOTHING;

    -- Insert into ZIP_CITY if not already present
    INSERT INTO ZIP_CITY(Zip_code, City, State, Country)
    VALUES (input_Zip_code, input_City, input_State, input_Country)
    ON CONFLICT (Zip_code, Country) DO NOTHING;

    -- Insert into Property table and return the generated Property_ID
    INSERT INTO Property(
        Owner_ID,
        Zip_code,
        Country,
        Date_of_construction,
        Create_at,
        Update_at,
        Door_no,
        Building_name,
        Street_name,
        Area,
        Type,
        Area_in_sqft,
        Facing,
        Description
    ) 
    VALUES (
        input_Owner_ID,
        input_Zip_code,
        input_Country,
        input_Date_of_construction,
        input_Create_at,
        input_Update_at,
        input_Door_no,
        input_Building_name,
        input_Street_name,
        input_Area,
        input_Type,
        input_Area_in_sqft,
        input_Facing,
        input_Description
    ) RETURNING Property_ID INTO new_property_id;

    RETURN new_property_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE add_land(
    new_property_id INT,
    input_Land_Type VARCHAR(11),
    input_Boundary_wall VARCHAR(10),
    input_Sale_type VARCHAR(10),
    input_Price_per_sqft DECIMAL(10, 2),
    input_Advance_Amount DECIMAL(10, 2),
    input_Negotiability VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Plot_lands (
        Property_ID,
        Type,
        Boundary_wall,
        Sale_type,
        Price_per_sqft,
        Advance_Amount,
        Negotiability
    ) 
    VALUES (
        new_property_id,
        input_Land_Type,
        input_Boundary_wall,
        input_Sale_type,
        input_Price_per_sqft,
        input_Advance_Amount,
        input_Negotiability
    );
END;
$$;


CREATE OR REPLACE PROCEDURE add_residential_building(
    new_property_id INT,
    input_Sale_type VARCHAR(4),
    input_Type VARCHAR(30),
    input_BHK_Type VARCHAR(2),
    input_Furnishing VARCHAR(30),
    input_Price DECIMAL(10, 2),
    input_Advance_amount DECIMAL(10, 2),
    input_Negotiability VARCHAR(3),
    input_Two_wheeler_parking VARCHAR(3),
    input_Four_wheeler_parking VARCHAR(3),
    input_Bathrooms INT,
    input_Floor INT,
    input_Lift_service VARCHAR(3)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Residential_buildings (
        Property_ID,
        Sale_type,
        Type,
        BHK_Type,
        Furnishing,
        Price,
        Advance_amount,
        Negotiability,
        Two_wheeler_parking,
        Four_wheeler_parking,
        Bathrooms,
        Floor,
        Lift_service
    )
    VALUES (
        new_property_ID,
        input_Sale_type,
        input_Type,
        input_BHK_Type,
        input_Furnishing,
        input_Price,
        input_Advance_amount,
        input_Negotiability,
        input_Two_wheeler_parking,
        input_Four_wheeler_parking,
        input_Bathrooms,
        input_Floor,
        input_Lift_service
    );
END;
$$;


CREATE OR REPLACE PROCEDURE add_commercial_building(
    new_property_id INT,
    input_Sale_type VARCHAR(4),
    input_Type VARCHAR(15),
    input_Parking VARCHAR(10),
    input_Furnishing VARCHAR(15),
    input_Price DECIMAL(10, 2),
    input_Advance_amount DECIMAL(10, 2),
    input_Negotiability VARCHAR(3),
    input_Start_floor INT,
    input_End_floor INT,
    input_Lift_service VARCHAR(3)
)
LANGUAGE plpgsql
AS $$
BEGIN  
    INSERT INTO Commercial_buildings (
        Property_ID,
        Sale_type,
        Type,
        Parking,
        Furnishing,
        Price,
        Advance_amount,
        Negotiability,
        Start_floor,
        End_floor,
        Lift_service
    )
    VALUES (
        new_property_ID,
        input_Sale_type,
        input_Type,
        input_Parking,
        input_Furnishing,
        input_Price,
        input_Advance_amount,
        input_Negotiability,
        input_Start_floor,
        input_End_floor,
        input_Lift_service
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_lease_payment_reminders(user_id INT)
RETURNS TABLE (
    lease_id INT,
    property_id INT,
    tenant_id INT,
    start_date DATE,
    end_date DATE,
    price DECIMAL(10, 2),
    advance_amount DECIMAL(10, 2),
    payment_id INT,
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMP,
    payment_status VARCHAR(15),
    reminder_type VARCHAR(50),
    building_name VARCHAR(100),
    street_name VARCHAR(100),
    area VARCHAR(100),
    address VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        la.Lease_ID,
        la.Property_ID,
        la.Tenant_ID,
        la.Start_date,
        la.End_date,
        la.Price,
        la.Advance_amount,
        lp.Payment_ID,
        lp.Amount AS payment_amount,
        lp.Date AS payment_date,
        lp.Status AS payment_status,
        CASE
            WHEN la.End_date > CURRENT_DATE AND lp.Status = 'pending' 
                THEN 'Upcoming'
            WHEN la.End_date < CURRENT_DATE AND lp.Status = 'pending' 
                THEN 'Past Due'
            ELSE 'Paid'
        END::VARCHAR(50) AS reminder_type,
        p.Building_name,
        p.Street_name,
        p.Area,
        CONCAT(p.Door_no, ', ', p.Building_name, ', ', p.Street_name, ', ', p.Area)::VARCHAR(255) AS address
    FROM 
        Lease_Agreement la
    LEFT JOIN 
        Lease_Payment lp ON la.Lease_ID = lp.Lease_ID
    LEFT JOIN 
        Property p ON la.Property_ID = p.Property_ID
    WHERE 
        la.Tenant_ID = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_admin_pending_maintenance_payments(adminId INT)
RETURNS TABLE (
    Request_ID INT,
    Lease_ID INT,
    Service VARCHAR,
    request_description VARCHAR,
    Building_name VARCHAR,
    Property_ID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.Request_ID, 
        m.Lease_ID, 
        m.Service, 
        m.Description AS request_description, 
        p.building_name, 
        p.property_id
    FROM Maintenance m
    LEFT JOIN Maintenance_Payment mp ON m.Request_ID = mp.Request_ID
    JOIN Property p ON m.Lease_ID = p.Property_ID
    WHERE p.Owner_ID = adminId
      AND m.Status = 'Resolved' 
      AND (mp.Request_ID IS NULL OR mp.Status != 'completed');
END;
$$;


