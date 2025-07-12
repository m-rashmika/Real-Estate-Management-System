import pool from '@/lib/db';

export async function GET(request: Request) {
    try{
        const userId = request.headers.get('User_ID');
        if (!userId) {
            return new Response(
            JSON.stringify({ message: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
    
        const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [userId]);
        if (userResult.rowCount === 0) {
            return new Response(
            JSON.stringify({ message: 'User not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
    
        const roleResult = await pool.query('SELECT Role FROM Roles WHERE User_ID = $1', [userId]);
        const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

        if(role === 'Tenant'){
            const enquiriesQuery = `
                SELECT 
                e.Enquiry_ID,
                e.Tenant_ID,
                e.Property_ID,
                e.Description,
                e.Approval,
                p.Building_name,
                CASE 
                    WHEN e.Approval = 'Approved' THEN a.First_name  || ' ' || a.Last_name 
                    ELSE NULL 
                END AS Ownername,
                CASE 
                    WHEN e.Approval = 'Approved' THEN a.Phone 
                    ELSE NULL 
                END AS Ownerphone,
                CASE 
                    WHEN e.Approval = 'Approved' THEN a.Email 
                    ELSE NULL 
                END AS Owneremail
            FROM 
                Enquiry e
            JOIN 
                Property p ON e.Property_ID = p.Property_ID
            LEFT JOIN 
                Users a ON p.Owner_ID = a.User_ID
            WHERE 
                e.Tenant_ID = $1;
            `;
            const enquiriesResult = await pool.query(enquiriesQuery, [userId]);
            const enquiries = enquiriesResult.rows;
            return new Response(
                JSON.stringify({ enquiries }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
        else if(role === 'Admin'){
            console.log("Admin Enquiries");
            const enquiriesQuery = `
                SELECT
                    Enquiry.Enquiry_ID,
                    Enquiry.Description,
                    Enquiry.Approval,
                    Enquiry.Tenant_ID,
                    Property.Property_ID,
                    Property.Building_name
                FROM Enquiry
                JOIN Property ON Enquiry.Property_ID = Property.Property_ID
                WHERE Property.Owner_ID = $1;
            `;

            const enquiriesResult = await pool.query(enquiriesQuery, [userId]);
            const enquiries = enquiriesResult.rows;

            return new Response(
                JSON.stringify({ enquiries }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }    
    }
    catch (error) {
        console.error("Error fetching enquiries:", error);
        return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(request: Request) {
    try{
        const userId = request.headers.get('User_ID');
        if (!userId) {
            return new Response(
            JSON.stringify({ message: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
    
        const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [userId]);
        if (userResult.rowCount === 0) {
            return new Response(
            JSON.stringify({ message: 'User not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
    
        const roleResult = await pool.query('SELECT Role FROM Roles WHERE User_ID = $1', [userId]);
        const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;
    
        if (role !== 'Tenant') {
            return new Response(
            JSON.stringify({ message: 'User is not an Tenant' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const propertyId = request.headers.get('Property_ID');
        if (!propertyId) {
            return new Response(
            JSON.stringify({ message: 'Property ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const requestBody = await request.json();
        const { description } = requestBody;

        const insertEnquiryQuery = `
            INSERT INTO Enquiry (Tenant_ID, Property_ID, Description)
            VALUES ($1, $2, $3) RETURNING Enquiry_ID;
        `;
        const { rows } = await pool.query(insertEnquiryQuery, [userId, propertyId, description]);

        if (rows.length > 0) {
            const enquiryId = rows[0].enquiry_id;
            return new Response(
                JSON.stringify({ message: 'Enquiry created successfully', Enquiry_ID: enquiryId }),
                { status: 201, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ message: 'Failed to create enquiry' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error("Error creating enquiry:", error);
        return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const { userId, enquiryId, newStatus } = await request.json();
    
        const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [userId]);
        if (userResult.rowCount === 0) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
    
        const roleResult = await pool.query('SELECT Role FROM Roles WHERE User_ID = $1', [userId]);
        const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

        if(role !== 'Admin') {
            return new Response(
                JSON.stringify({ message: 'User is not an Admin' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        if (!enquiryId || !newStatus) {
            return new Response('Missing parameters', { status: 400 });
        }

        const updateQuery = `
            UPDATE Enquiry
            SET Approval = $1
            WHERE Enquiry_ID = $2
            RETURNING *;
        `;

        const result = await pool.query(updateQuery, [newStatus, enquiryId]);

        if (result.rowCount === 0) {
            return new Response('Enquiry not found', { status: 404 });
        }

        return new Response(JSON.stringify(result.rows[0]), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error updating enquiry status:', error);
        return new Response('Error updating status', { status: 500 });
    }
}
