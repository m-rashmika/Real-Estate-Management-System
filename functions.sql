CREATE OR REPLACE PROCEDURE add_land(
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
    input_Availability VARCHAR(20),
    input_Past_tenant_count INT,
    input_Description VARCHAR(500),
    input_Land_Type VARCHAR(11),
    input_Boundary_wall VARCHAR(10),
    input_Sale_type VARCHAR(10),
    input_Price_per_sqft DECIMAL(10, 2),
    input_Advance_Amount DECIMAL(10, 2),
    input_Negotiability VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
DECLARE 
    new_property_id INT;
BEGIN
     INSERT INTO COUNTRY_STATE(State, Country) 
    VALUES (input_State, input_Country)
    ON CONFLICT (State) DO NOTHING;
    
    INSERT INTO CITY_STATE(City, State)
    VALUES (input_City, input_State)
    ON CONFLICT (City, State) DO NOTHING;
    
    INSERT INTO ZIP_CITY(Zip_code, City, State, Country)
    VALUES (input_Zip_code, input_City, input_State, input_Country)
    ON CONFLICT (Zip_code, Country) DO NOTHING;

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
        Availability,
        Past_tenant_count,
        Description
    ) VALUES (
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
        input_Availability,
        input_Past_tenant_count,
        input_Description
    ) RETURNING Property_ID INTO new_property_id;

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


--to add data to respected type (residential_buildings)
CREATE OR REPLACE PROCEDURE add_residential_building(
    input_Owner_ID INT,
    input_Zip_code VARCHAR(10),
    input_Country VARCHAR(100),
     input_State VARCHAR(100),
    input_City VARCHAR(100),
    input_Date_of_construction DATE,
    input_Door_no VARCHAR(50),
    input_Building_name VARCHAR(100),
    input_Street_name VARCHAR(100),
    input_Area VARCHAR(100),
    input_Area_in_sqft FLOAT,
    input_Facing VARCHAR(15),
    input_Availability VARCHAR(15),
    input_Description VARCHAR(500),
    input_Sale_type VARCHAR(4),
    input_Type VARCHAR(20),
    input_BHK_Type VARCHAR(2),
    input_Furnishing VARCHAR(20),
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
DECLARE
    new_property_ID INT;
BEGIN
    INSERT INTO COUNTRY_STATE(State, Country) 
    VALUES (input_State, input_Country)
    ON CONFLICT (State) DO NOTHING;
    
    INSERT INTO CITY_STATE(City, State)
    VALUES (input_City, input_State)
    ON CONFLICT (City, State) DO NOTHING;
    
    INSERT INTO ZIP_CITY(Zip_code, City, State, Country)
    VALUES (input_Zip_code, input_City, input_State, input_Country)
    ON CONFLICT (Zip_code, Country) DO NOTHING;

    INSERT INTO Property (
        Owner_ID,
        Zip_code,
        Country,
        Date_of_construction,
        Door_no,
        Building_name,
        Street_name,
        Area,
        Type,
        Area_in_sqft,
        Facing,
        Availability,
        Description
    )
    VALUES (
        input_Owner_ID,
        input_Zip_code,
        input_Country,
        input_Date_of_construction,
        input_Door_no,
        input_Building_name,
        input_Street_name,
        input_Area,
        'Residential Building',
        input_Area_in_sqft,
        input_Facing,
        input_Availability,
        input_Description
    )
    RETURNING Property_ID INTO new_property_ID;

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

--to add data to respected type (commercial_buildings)
CREATE OR REPLACE PROCEDURE add_commercial_building(
    input_Owner_ID INT,
    input_Zip_code VARCHAR(10),
    input_Country VARCHAR(100),
     input_State VARCHAR(100),
    input_City VARCHAR(100),
    input_Date_of_construction DATE,
    input_Door_no VARCHAR(50),
    input_Building_name VARCHAR(100),
    input_Street_name VARCHAR(100),
    input_Area VARCHAR(100),
    input_Area_in_sqft FLOAT,
    input_Facing VARCHAR(15),
    input_Availability VARCHAR(20),
    input_Description VARCHAR(500),
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
DECLARE
    new_property_ID INT;
BEGIN  
    INSERT INTO COUNTRY_STATE(State, Country) 
    VALUES (input_State, input_Country)
    ON CONFLICT (State) DO NOTHING;
    
    INSERT INTO CITY_STATE(City, State)
    VALUES (input_City, input_State)
    ON CONFLICT (City, State) DO NOTHING;
    
    INSERT INTO ZIP_CITY(Zip_code, City, State, Country)
    VALUES (input_Zip_code, input_City, input_State, input_Country)
    ON CONFLICT (Zip_code, Country) DO NOTHING;

    INSERT INTO Property (
        Owner_ID,
        Zip_code,
        Country,
        Date_of_construction,
        Door_no,
        Building_name,
        Street_name,
        Area,
        Type,
        Area_in_sqft,
        Facing,
        Availability,
        Description
    )
    VALUES (
        input_Owner_ID,
        input_Zip_code,
        input_Country,
        input_Date_of_construction,
        input_Door_no,
        input_Building_name,
        input_Street_name,
        input_Area,
        'Commercial Building',
        input_Area_in_sqft,
        input_Facing,
        input_Availability,
        input_Description
    )
    RETURNING Property_ID INTO new_property_ID;

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


--when the the tenant renewed the agreement,the old agreement will be expired and new agreement will be created with advance 0.00 
CREATE OR REPLACE PROCEDURE if_renewed(in_lease_id INT,in_property_id INT,in_tenant_id INT,
IN_end_date DATE,in_price DECIMAL(10,2))
LANGUAGE plpgsql
AS $$
DECLARE old_end_date DATE;
BEGIN
SELECT End_date INTO old_end_date
FROM Lease_Agreement WHERE Lease_ID = in_lease_id;
--UPDATE OLD Lease_Agreement status to 'expired' and update_at  now.
UPDATE Lease_Agreement
SET Status ='expired',
Updated_at =NOW()
WHERE Lease_ID =in_lease_id;
--insert new lease_agreement
INSERT INTO Lease_Agreement (
        Property_ID,
        Tenant_ID,
        Start_date,
        End_date,
        Renewed,
        Price,
        Advance_amount,
        Status,
        Created_at,
        Updated_at
    )
    VALUES (
        in_property_id,
        in_tenant_id,
        old_end_date + INTERVAL '1 day', 
        -- Start date is the day after the old lease ends
        in_end_date,
        'NO',
        in_price,
        0.00,
      'active',
        NOW(),
        NOW()
    );
END;
$$;

--ensures that an user being inserted to into Admins table must have the role admin
CREATE FUNCTION check_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM Roles
        WHERE User_ID = NEW.User_ID AND Role = 'Admin'
    ) THEN
        RAISE EXCEPTION 'User must have Admin role';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER check_admin_role_trigger
BEFORE INSERT ON Admins
FOR EACH ROW
EXECUTE FUNCTION check_admin_role();

--ensures that an user being inserted to into Staff table must have the role staff
CREATE FUNCTION check_staff_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM Roles
        WHERE User_ID = NEW.User_ID AND Role = 'Staff'
    ) THEN
        RAISE EXCEPTION 'User must have staff role';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_staff_role_trigger
BEFORE INSERT ON Staff
FOR EACH ROW
EXECUTE FUNCTION check_staff_role();

--This trigger ensures that only users with the Tenant role can be assigned as a Tenant_ID in the Lease and sale Agreement
CREATE FUNCTION check_tenant_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM Roles
        WHERE User_ID = NEW.Tenant_ID AND Role = 'tenant'
    ) THEN
        RAISE EXCEPTION 'User must have tenant role';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_tenant_role_in_lease_trigger
BEFORE INSERT OR UPDATE ON Lease_Agreement
FOR EACH ROW
EXECUTE FUNCTION check_tenant_role();

CREATE TRIGGER check_tenant_role_in_sale_trigger
BEFORE INSERT OR UPDATE ON Sale_Agreement
FOR EACH ROW
EXECUTE FUNCTION check_tenant_role();

--adds the data based on respective roles and also checking the duplicate roles of a particular user.
CREATE OR REPLACE PROCEDURE add_user_with_role(
    input_first_name VARCHAR(30),
    input_middle_name VARCHAR(30),
    input_last_name VARCHAR(30),
    input_email VARCHAR(100),
    input_phone VARCHAR(15),
    input_password_hash VARCHAR(80),
    input_role VARCHAR(10),  
    --  parameters for Admin:-*
    input_UPI_ID VARCHAR(60) DEFAULT NULL,
    input_Account_no VARCHAR(20) DEFAULT NULL,
    input_IFSC_code  VARCHAR(20) DEFAULT NULL,
    input_Bank_name VARCHAR(100) DEFAULT NULL,
    input_Bank_Branch VARCHAR(100) DEFAULT NULL,
    input_Account_holder_name VARCHAR(100) DEFAULT NULL,
    -- parameter for Staff:
    input_Service            VARCHAR(15) DEFAULT NULL,
    input_Availability       BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
DECLARE
    existing_user_id INT;
    new_user_id INT;
BEGIN
    -- Check if a user with the same email and role already exists.
    SELECT u.User_ID
      INTO existing_user_id
      FROM Users u
      JOIN Roles r ON u.User_ID = r.User_ID
     WHERE u.Email = input_email
       AND r.Role = input_role;
       
    IF existing_user_id IS NOT NULL THEN
        RAISE EXCEPTION 'User with email "%" and role "%" already exists.', input_email, input_role;
    END IF;
    
    -- Insert a new record into Users.
    INSERT INTO Users (First_name, Middle_name, Last_name, Email, Phone, Password_hash)
    VALUES (input_first_name, input_middle_name, input_last_name, input_email, input_phone, input_password_hash)
    RETURNING User_ID INTO new_user_id;
    
    -- Insert the role into Roles.
    INSERT INTO Roles (User_ID, Role)
    VALUES (new_user_id, input_role);
    
    -- role-specific details:
    IF input_role = 'Admin' THEN
        INSERT INTO Admins (User_ID, UPI_ID, Account_no, IFSC_code, Bank_name, Bank_Branch, Account_holder_name)
        VALUES (new_user_id, input_UPI_ID, input_Account_no, input_IFSC_code, input_Bank_name, input_Bank_Branch, input_Account_holder_name);
    ELSIF input_role = 'Staff' THEN
        INSERT INTO Staff (User_ID, Service, Account_no, IFSC_code, Bank_name, Bank_Branch, Account_holder_name, UPI_ID, Availability)
        VALUES (new_user_id, input_Service, input_Account_no, input_IFSC_code, input_Bank_name, input_Bank_Branch, input_Account_holder_name, input_UPI_ID, input_Availability);
    END IF;
    
    -- For tenant role, no additional insertion is needed.
    
END;
$$;

--The prevention of creating a new lease agreement on a property before the end date of past agreement.
CREATE OR REPLACE FUNCTION prevent_overlapping_leases()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Lease_Agreement
        WHERE Property_ID = NEW.Property_ID
        AND Lease_ID != NEW.Lease_ID -- Exclude the current row if updating
        AND Status IN ('active', 'expired')
        AND (NEW.Start_date, NEW.End_date) OVERLAPS (Start_date, End_date)
    ) THEN
        RAISE EXCEPTION 'Overlapping lease agreement detected';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_overlapping_leases_trigger
BEFORE INSERT OR UPDATE ON Lease_Agreement
FOR EACH ROW
EXECUTE PROCEDURE prevent_overlapping_leases();

--Updation of status of staff and the maintenance work .
CREATE OR REPLACE PROCEDURE manage_maintenance(
    input_request_id INT,
    input_staff_id INT DEFAULT NULL,
    input_new_status VARCHAR(10) DEFAULT NULL -- Expected values: 'Pending', 'Assigned', 'Resolved', 'In progress', 'Cancelled'
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_status VARCHAR(10);
    current_staff INT;
BEGIN
    -- Get current status and staff of the maintenance request
    SELECT Status, Staff_ID
      INTO current_status, current_staff
      FROM Maintenance
     WHERE Request_ID = input_request_id;

    IF input_request_id IS NULL OR NOT FOUND THEN
        RAISE EXCEPTION 'Maintenance request ID % not found.', input_request_id;
    END IF;

    IF input_staff_id IS NOT NULL THEN
        -- Check if the staff member exists and is available
        IF NOT EXISTS (SELECT 1 FROM Staff WHERE User_ID = input_staff_id AND Availability IS TRUE) THEN
            RAISE EXCEPTION 'Staff member with ID % is not available.', input_staff_id;
        END IF;
        -- Update maintenance record: set the staff and status to 'Assigned'
        UPDATE Maintenance
        SET Staff_ID   = input_staff_id,
            Status     = 'Assigned',
            Updated_at = NOW()
        WHERE Request_ID = input_request_id;

        -- Mark the assigned staff as unavailable
        UPDATE Staff
        SET Availability = FALSE
        WHERE User_ID = input_staff_id;
    ELSE
        -- Only updating the status without reassigning staff
        UPDATE Maintenance
        SET Status     = input_new_status,
            Updated_at = NOW()
        WHERE Request_ID = input_request_id;

        -- If the updated status means the work is completed or cancelled,
        -- mark the assigned staff (if any) as available
        IF input_new_status IN ('Resolved', 'Cancelled') THEN
            IF current_staff IS NOT NULL THEN
                UPDATE Staff
                SET Availability = TRUE
                WHERE User_ID = current_staff;
            END IF;
        END IF;
    END IF;
END;
$$;

--trigger to expire the lease agreement
CREATE OR REPLACE FUNCTION expire_lease()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.End_date <= CURRENT_DATE THEN
        NEW.Status := 'expired';
        NEW.Updated_at := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expire_lease_trigger
BEFORE INSERT OR UPDATE ON Lease_Agreement
FOR EACH ROW
EXECUTE PROCEDURE expire_lease();

--trigger to update the availability as true or false according to the work status
CREATE OR REPLACE FUNCTION update_staff_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Update staff availability to TRUE when maintenance is resolved or cancelled
    IF NEW.Status IN ('Resolved', 'Cancelled') THEN
        UPDATE Staff
        SET Availability = TRUE
        WHERE User_ID = NEW.Staff_ID;
    END IF;
    -- Update staff availability to FALSE when maintenance is assigned
    IF NEW.Status = 'Assigned' THEN
        UPDATE Staff
        SET Availability = FALSE
        WHERE User_ID = NEW.Staff_ID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_staff_availability
AFTER INSERT OR UPDATE ON Maintenance
FOR EACH ROW
EXECUTE FUNCTION update_staff_availability();


--trigger to add the data based on respective roles and also checking the duplicate roles of a particular user.
CREATE OR REPLACE FUNCTION check_unique_email_role_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_email VARCHAR(100);
    v_count INT;
BEGIN
    -- Retrieve the email for the given user from Users table
    SELECT Email INTO v_email
      FROM Users
     WHERE User_ID = NEW.User_ID;
     
    -- Count any Roles rows (joined with Users) that already have the same email and role.
    SELECT COUNT(*) INTO v_count
      FROM Roles r
      JOIN Users u ON r.User_ID = u.User_ID
     WHERE u.Email = v_email
       AND r.Role = NEW.Role;
       
    IF v_count > 0 THEN
        RAISE EXCEPTION 'User with email "%" and role "%" already exists.', v_email, NEW.Role;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER check_unique_email_role_trg
BEFORE INSERT ON Roles
FOR EACH ROW
EXECUTE FUNCTION check_unique_email_role_fn();


--selecting the ones before 7 days
CREATE OR REPLACE FUNCTION get_due_leases_with_admins()
RETURNS TABLE (
    Lease_ID INT,
    Property_ID INT,
    Tenant_ID INT,
    Tenant_Email VARCHAR(100),
    Tenant_Phone VARCHAR(15),
    Admin_ID INT,
    Admin_Email VARCHAR(100),
    Admin_Phone VARCHAR(15),
    End_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.Lease_ID,
        l.Property_ID,
        l.Tenant_ID,
        t.Email AS Tenant_Email,
        t.Phone AS Tenant_Phone,
        a.User_ID AS Admin_ID,
        a.Email AS Admin_Email,
        a.Phone AS Admin_Phone,
        l.End_date
    FROM Lease_Agreement l
    JOIN Users t ON l.Tenant_ID = t.User_ID
    JOIN Property p ON l.Property_ID = p.Property_ID
    JOIN Admins ad ON p.Owner_ID = ad.User_ID
    JOIN Users a ON ad.User_ID = a.User_ID
    WHERE l.End_date = CURRENT_DATE + INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_due_leases_with_admins();


--select all property characteristics based on type
CREATE OR REPLACE FUNCTION get_complete_property_details(p_property_id INT)
RETURNS TABLE (
    -- Common property details
    Property_ID INT,
    Owner_ID INT,
    Property_Type VARCHAR(20),
    
    -- Location details
    Zip_code VARCHAR(10),
    Country VARCHAR(100),
    State VARCHAR(100),
    City VARCHAR(100),
    Door_no VARCHAR(50),
    Building_name VARCHAR(100),
    Street_name VARCHAR(100),
    Area VARCHAR(100),
    
    -- Common property attributes
    Date_of_construction DATE,
    Area_in_sqft FLOAT,
    Facing VARCHAR(15),
    Availability VARCHAR(15),
    Past_tenant_count INT,
    Description VARCHAR(500),
    
    -- Type-specific details with nullable columns for all types
    -- Land details
    Land_Type VARCHAR(10),
    Boundary_wall VARCHAR(10),
    Land_Sale_type VARCHAR(10),
    Price_per_sqft DECIMAL(10, 2),
    Land_Advance_Amount DECIMAL(10, 2),
    Land_Negotiability VARCHAR(10),
    
    -- Residential details
    Residential_Sale_type VARCHAR(4),
    Building_Type VARCHAR(20),
    BHK_Type VARCHAR(2),
    Residential_Furnishing VARCHAR(15),
    Residential_Price DECIMAL(10, 2),
    Residential_Advance_amount DECIMAL(10, 2),
    Residential_Negotiability VARCHAR(3),
    Two_wheeler_parking VARCHAR(3),
    Four_wheeler_parking VARCHAR(3),
    Bathrooms INT,
    Floor INT,
    Residential_Lift_service VARCHAR(3),
    
    -- Commercial details
    Commercial_Sale_type VARCHAR(4),
    Commercial_Building_Type VARCHAR(15),
    Parking VARCHAR(7),
    Commercial_Furnishing VARCHAR(15),
    Commercial_Price DECIMAL(10, 2),
    Commercial_Advance_amount DECIMAL(10, 2),
    Commercial_Negotiability VARCHAR(3),
    Start_floor INT,
    End_floor INT,
    Commercial_Lift_service VARCHAR(3)
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_property_type VARCHAR(20);
BEGIN
    -- First get the property type
    SELECT Type INTO v_property_type 
    FROM Property 
    WHERE Property.Property_ID = p_property_id;
    
    IF v_property_type IS NULL THEN
        RAISE EXCEPTION 'Property with ID % not found', p_property_id;
    END IF;
    
    -- Get base property details with location for any property type
    IF v_property_type = 'Land' THEN
        RETURN QUERY
        SELECT 
            p.Property_ID,
            p.Owner_ID,
            p.Type AS Property_Type,
            
            p.Zip_code,
            p.Country,
            zc.State,
            zc.City,
            p.Door_no,
            p.Building_name,
            p.Street_name,
            p.Area,
            
            p.Date_of_construction,
            p.Area_in_sqft,
            p.Facing,
            p.Availability,
            p.Past_tenant_count,
            p.Description,
            
            -- Land-specific details
            pl.Type AS Land_Type,
            pl.Boundary_wall,
            pl.Sale_type AS Land_Sale_type,
            pl.Price_per_sqft,
            pl.Advance_Amount AS Land_Advance_Amount,
            pl.Negotiability AS Land_Negotiability,
            
            -- Residential fields (NULL)
            NULL::VARCHAR(4) AS Residential_Sale_type,
            NULL::VARCHAR(20) AS Building_Type,
            NULL::VARCHAR(2) AS BHK_Type,
            NULL::VARCHAR(15) AS Residential_Furnishing,
            NULL::DECIMAL(10,2) AS Residential_Price,
            NULL::DECIMAL(10,2) AS Residential_Advance_amount,
            NULL::VARCHAR(3) AS Residential_Negotiability,
            NULL::VARCHAR(3) AS Two_wheeler_parking,
            NULL::VARCHAR(3) AS Four_wheeler_parking,
            NULL::INT AS Bathrooms,
            NULL::INT AS Floor,
            NULL::VARCHAR(3) AS Residential_Lift_service,
            
            -- Commercial fields (NULL)
            NULL::VARCHAR(4) AS Commercial_Sale_type,
            NULL::VARCHAR(15) AS Commercial_Building_Type,
            NULL::VARCHAR(7) AS Parking,
            NULL::VARCHAR(15) AS Commercial_Furnishing,
            NULL::DECIMAL(10,2) AS Commercial_Price,
            NULL::DECIMAL(10,2) AS Commercial_Advance_amount,
            NULL::VARCHAR(3) AS Commercial_Negotiability,
            NULL::INT AS Start_floor,
            NULL::INT AS End_floor,
            NULL::VARCHAR(3) AS Commercial_Lift_service
        FROM 
            Property p
        JOIN 
            Plot_lands pl ON p.Property_ID = pl.Property_ID
        JOIN 
            ZIP_CITY zc ON p.Zip_code = zc.Zip_code AND p.Country = zc.Country
        WHERE 
            p.Property_ID = p_property_id;
            
    ELSIF v_property_type = 'Residential Building' THEN
        RETURN QUERY
        SELECT 
            p.Property_ID,
            p.Owner_ID,
            p.Type AS Property_Type,
            
            p.Zip_code,
            p.Country,
            zc.State,
            zc.City,
            p.Door_no,
            p.Building_name,
            p.Street_name,
            p.Area,
            
            p.Date_of_construction,
            p.Area_in_sqft,
            p.Facing,
            p.Availability,
            p.Past_tenant_count,
            p.Description,
            
            -- Land fields (NULL)
            NULL::VARCHAR(10) AS Land_Type,
            NULL::VARCHAR(10) AS Boundary_wall,
            NULL::VARCHAR(10) AS Land_Sale_type,
            NULL::DECIMAL(10,2) AS Price_per_sqft,
            NULL::DECIMAL(10,2) AS Land_Advance_Amount,
            NULL::VARCHAR(3) AS Land_Negotiability,
            
            -- Residential-specific details
            rb.Sale_type AS Residential_Sale_type,
            rb.Type AS Building_Type,
            rb.BHK_Type,
            rb.Furnishing AS Residential_Furnishing,
            rb.Price AS Residential_Price,
            rb.Advance_amount AS Residential_Advance_amount,
            rb.Negotiability AS Residential_Negotiability,
            rb.Two_wheeler_parking,
            rb.Four_wheeler_parking,
            rb.Bathrooms,
            rb.Floor,
            rb.Lift_service AS Residential_Lift_service,
            
            -- Commercial fields (NULL)
            NULL::VARCHAR(4) AS Commercial_Sale_type,
            NULL::VARCHAR(15) AS Commercial_Building_Type,
            NULL::VARCHAR(7) AS Parking,
            NULL::VARCHAR(15) AS Commercial_Furnishing,
            NULL::DECIMAL(10,2) AS Commercial_Price,
            NULL::DECIMAL(10,2) AS Commercial_Advance_amount,
            NULL::VARCHAR(3) AS Commercial_Negotiability,
            NULL::INT AS Start_floor,
            NULL::INT AS End_floor,
            NULL::VARCHAR(3) AS Commercial_Lift_service
        FROM 
            Property p
        JOIN 
            Residential_buildings rb ON p.Property_ID = rb.Property_ID
        JOIN 
            ZIP_CITY zc ON p.Zip_code = zc.Zip_code AND p.Country = zc.Country
        WHERE 
            p.Property_ID = p_property_id;
            
    ELSIF v_property_type = 'Commercial Building' THEN
        RETURN QUERY
        SELECT 
            p.Property_ID,
            p.Owner_ID,
            p.Type AS Property_Type,
            
            p.Zip_code,
            p.Country,
            zc.State,
            zc.City,
            p.Door_no,
            p.Building_name,
            p.Street_name,
            p.Area,
            
            p.Date_of_construction,
            p.Area_in_sqft,
            p.Facing,
            p.Availability,
            p.Past_tenant_count,
            p.Description,
            
            -- Land fields (NULL)
            NULL::VARCHAR(10) AS Land_Type,
            NULL::VARCHAR(10) AS Boundary_wall,
            NULL::VARCHAR(10) AS Land_Sale_type,
            NULL::DECIMAL(10,2) AS Price_per_sqft,
            NULL::DECIMAL(10,2) AS Land_Advance_Amount,
            NULL::VARCHAR(3) AS Land_Negotiability,
            
            -- Residential fields (NULL)
            NULL::VARCHAR(4) AS Residential_Sale_type,
            NULL::VARCHAR(20) AS Building_Type,
            NULL::VARCHAR(2) AS BHK_Type,
            NULL::VARCHAR(15) AS Residential_Furnishing,
            NULL::DECIMAL(10,2) AS Residential_Price,
            NULL::DECIMAL(10,2) AS Residential_Advance_amount,
            NULL::VARCHAR(3) AS Residential_Negotiability,
            NULL::VARCHAR(3) AS Two_wheeler_parking,
            NULL::VARCHAR(3) AS Four_wheeler_parking,
            NULL::INT AS Bathrooms,
            NULL::INT AS Floor,
            NULL::VARCHAR(3) AS Residential_Lift_service,
            
            -- Commercial-specific details
            cb.Sale_type AS Commercial_Sale_type,
            cb.Type AS Commercial_Building_Type,
            cb.Parking,
            cb.Furnishing AS Commercial_Furnishing,
            cb.Price AS Commercial_Price,
            cb.Advance_amount AS Commercial_Advance_amount,
            cb.Negotiability AS Commercial_Negotiability,
            cb.Start_floor,
            cb.End_floor,
            cb.Lift_service AS Commercial_Lift_service
        FROM 
            Property p
        JOIN 
            Commercial_buildings cb ON p.Property_ID = cb.Property_ID
        JOIN 
            ZIP_CITY zc ON p.Zip_code = zc.Zip_code AND p.Country = zc.Country
        WHERE 
            p.Property_ID = p_property_id;
    ELSE
        RAISE EXCEPTION 'Unknown property type: %', v_property_type;
    END IF;
END;
$$;


-- to get all the details for maintenance
CREATE OR REPLACE FUNCTION get_maintenance_details(
    p_request_id INT DEFAULT NULL,
    p_property_id INT DEFAULT NULL,
    p_tenant_id INT DEFAULT NULL,
    p_staff_id INT DEFAULT NULL
)
RETURNS TABLE (
    -- Maintenance request details
    request_id INT,
    property_id INT,
    
    -- Tenant information
    tenant_id INT,
    tenant_name TEXT,
    tenant_email VARCHAR(100),
    tenant_phone VARCHAR(15),
    
    -- Admin/Owner information
    admin_id INT,
    admin_name TEXT,
    admin_email VARCHAR(100),
    admin_phone VARCHAR(15),
    
    -- Staff information
    staff_id INT,
    staff_name TEXT,
    staff_email VARCHAR(100),
    staff_phone VARCHAR(15),
    staff_service VARCHAR(15),
    staff_availability BOOLEAN,
    
    -- Maintenance details
    service VARCHAR(15),
    description VARCHAR(300),
    status VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Payment information
    payment_id INT,
    payment_date TIMESTAMP,
    payment_amount DECIMAL(10, 2),
    payment_mode VARCHAR(10),
    transaction_id VARCHAR(50),
    payment_status VARCHAR(15)
) 
LANGUAGE plpgsql
AS $$
DECLARE
    -- Variable to store ambiguous column reference error
    error_message TEXT;
BEGIN
    
    BEGIN 
        IF p_property_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM property WHERE property.property_id = p_property_id
        ) THEN
            RAISE EXCEPTION 'Property with ID % does not exist', p_property_id;
        END IF;
        
        IF p_tenant_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM users WHERE users.user_id = p_tenant_id
        ) THEN
            RAISE EXCEPTION 'Tenant with ID % does not exist', p_tenant_id;
        END IF;
        
        IF p_staff_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM staff WHERE staff.user_id = p_staff_id
        ) THEN
            RAISE EXCEPTION 'Staff with ID % does not exist', p_staff_id;
        END IF;
        
        IF p_request_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM maintenance WHERE maintenance.request_id = p_request_id
        ) THEN
            RAISE EXCEPTION 'Maintenance request with ID % does not exist', p_request_id;
        END IF;
    EXCEPTION
        WHEN others THEN
            -- Capture the error message and re-raise with more details
            GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT;
            RAISE EXCEPTION 'Error during validation: %', error_message;
    END;

    RETURN QUERY
    SELECT 
        m.request_id,
        p.property_id,
        
        t.user_id AS tenant_id,
        CONCAT(t.first_name, ' ', t.last_name) AS tenant_name,
        t.email AS tenant_email,
        t.phone AS tenant_phone,
        
        a.user_id AS admin_id,
        CONCAT(a.first_name, ' ', a.last_name) AS admin_name,
        a.email AS admin_email,
        a.phone AS admin_phone,
        
        s.user_id AS staff_id,
        CASE WHEN sf.user_id IS NOT NULL THEN CONCAT(sf.first_name, ' ', sf.last_name) ELSE NULL END AS staff_name,
        sf.email AS staff_email,
        sf.phone AS staff_phone,
        s.service AS staff_service,
        s.availability AS staff_availability,
        
        m.service,
        m.description,
        m.status,
        m.created_at,
        m.updated_at,
        
        mp.payment_id,
        mp.date AS payment_date,
        mp.amount AS payment_amount,
        mp.mode AS payment_mode,
        mp.transaction_id,
        mp.status AS payment_status
    FROM 
        maintenance m
    -- Join with Lease_Agreement to get tenant and property info
    JOIN 
        lease_agreement la ON m.lease_id = la.lease_id
    -- Join with Property to get property details
    JOIN 
        property p ON la.property_id = p.property_id
    -- Join with Users (tenant) to get tenant details
    JOIN 
        users t ON la.tenant_id = t.user_id
    -- Join with Admins to get owner/admin info
    JOIN 
        admins adm ON p.owner_id = adm.user_id
    -- Join with Users (admin) to get admin details
    JOIN 
        users a ON adm.user_id = a.user_id
    -- Left join with Staff since it might be NULL for pending requests
    LEFT JOIN 
        staff s ON m.staff_id = s.user_id
    -- Left join with Users (staff) to get staff details if assigned
    LEFT JOIN 
        users sf ON s.user_id = sf.user_id
    -- Left join with Maintenance_Payment since payment might not exist yet
    LEFT JOIN 
        maintenance_payment mp ON m.request_id = mp.request_id
    WHERE
        (p_request_id IS NULL OR m.request_id = p_request_id) AND
        (p_property_id IS NULL OR p.property_id = p_property_id) AND
        (p_tenant_id IS NULL OR t.user_id = p_tenant_id) AND
        (p_staff_id IS NULL OR s.user_id = p_staff_id)
    ORDER BY 
        m.created_at DESC;

EXCEPTION
    WHEN others THEN
        -- Get the error message
        GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT;
        RAISE EXCEPTION 'Error in get_maintenance_details: %', error_message;
END;
$$;
