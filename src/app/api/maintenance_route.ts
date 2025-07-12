"use server"
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const req = await request.json();
    console.log(req)
    if (!req.lease_id || !req.service || !req.description) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const userId = request.headers.get('User_ID');
    if (!userId) {
        return new Response(JSON.stringify({ message: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const userResult = await pool.query(
        'SELECT * FROM Users WHERE User_ID = $1',
        [userId]
    );
    
    if (userResult.rowCount === 0) {
        return new Response(JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    const user = userResult.rows[0];
    
    const roleResult = await pool.query(
        'SELECT Role FROM Roles WHERE User_ID = $1',
        [userId]
    );
    
    const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;
    
    if (role !== 'Tenant') {
        return new Response( JSON.stringify({ message: 'User is not a Tenant' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
    
    try {
        await pool.query('BEGIN');
    
        const result = await pool.query(
            'INSERT INTO Maintenance (Lease_ID, Service, Description) VALUES ($1, $2, $3) RETURNING Request_ID',
            [req.lease_id, req.service, req.description]
        );
    
        const requestId = result.rows[0].request_id;
    
        await pool.query('COMMIT');
    
        return NextResponse.json({ message: 'Maintenance request submitted successfully', requestId }, { status: 201 });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        return NextResponse.json({ error: 'Error submitting maintenance request' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
      const userId = request.headers.get('User_ID');
  
      if (!userId) {
        return new Response('User ID is required', { status: 400 });
      }
  
      const userResult = await pool.query(
        'SELECT * FROM Users WHERE User_ID = $1',
        [userId]
      );
  
      if (userResult.rowCount === 0) {
        return new Response('User not found', { status: 404 });
      }
  
      const user = userResult.rows[0];
  
      const roleResult = await pool.query(
        'SELECT Role FROM Roles WHERE User_ID = $1',
        [userId]
      );
  
      const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

      if(role === 'Tenant'){
        const currentRequestsQuery = `
            SELECT
                Maintenance.Request_ID, Property.Building_name, Maintenance.Service, Maintenance.Description, Maintenance.Status,
                Maintenance.Created_at, Maintenance.Status, Staff.First_name || Staff.Last_name as StaffName, Staff.Phone as StaffNumber,
                Users.First_name || ' ' || Users.Last_name as OwnerName, Users.Phone as OwnerPhone
            FROM Maintenance
            JOIN Lease_Agreement ON Maintenance.Lease_ID = Lease_Agreement.Lease_ID
            JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
            JOIN Users ON Property.Owner_ID = Users.User_ID
            LEFT JOIN  Users AS Staff ON Maintenance.Staff_ID = Staff.User_ID
            WHERE Lease_Agreement.Tenant_ID = $1 AND Maintenance.Status IN ('Pending', 'Assigned', 'In progress')
        `;

        const pastRequestsQuery = `
            SELECT
                Maintenance.Request_ID, Property.Building_name, Maintenance.Service, Maintenance.Description, Maintenance.Status,
                Maintenance.Created_at, Maintenance.Status, Staff.First_name || Staff.Last_name as StaffName, Staff.Phone as StaffNumber,
                Users.First_name || ' ' || Users.Last_name as OwnerName, Users.Phone as OwnerPhone
            FROM Maintenance
            JOIN Lease_Agreement ON Maintenance.Lease_ID = Lease_Agreement.Lease_ID
            JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
            JOIN Users ON Property.Owner_ID = Users.User_ID
            LEFT JOIN Users AS Staff ON Maintenance.Staff_ID = Staff.User_ID
            WHERE Lease_Agreement.Tenant_ID = $1 AND Maintenance.Status = 'Resolved'
        `;
  
        const [currentRequestsRes, pastRequestsRes] = await Promise.all([
            pool.query(currentRequestsQuery, [userId]),
            pool.query(pastRequestsQuery, [userId]),
          ]);
  
        const currentRequests = currentRequestsRes.rows;
        const pastRequests = pastRequestsRes.rows;
  
        return new Response(JSON.stringify({ currentRequests, pastRequests }), {
            headers: { 'Content-Type': 'application/json' },
        });
      }
      else if (role === 'Staff') {
        const staffRequestsQuery = `
            SELECT
                Maintenance.Request_ID,
                Property.Building_name,
                Maintenance.Service,
                Maintenance.Description,
                Maintenance.Created_at,
                Maintenance.Status,
                Tenant.First_name || ' ' || Tenant.Last_name as TenantName,
                Tenant.Phone as TenantNumber,
                Owner.First_name || ' ' || Owner.Last_name as OwnerName,
                Owner.Phone as OwnerPhone
            FROM Maintenance
            JOIN Lease_Agreement ON Maintenance.Lease_ID = Lease_Agreement.Lease_ID
            JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
            JOIN Users AS Owner ON Property.Owner_ID = Owner.User_ID
            JOIN Users AS Tenant ON Lease_Agreement.Tenant_ID = Tenant.User_ID
            WHERE Maintenance.Staff_ID = $1
        `;
  
        const staffRequestsRes = await pool.query(staffRequestsQuery, [userId]);
        const staffRequests = staffRequestsRes.rows;
  
        return new Response(JSON.stringify({ staffRequests }), {
            headers: { 'Content-Type': 'application/json' },
        });
      }
      else if(role === 'Admin'){
        const adminRequestsQuery = `
            SELECT
                Maintenance.Request_ID,
                Property.Building_name,
                Maintenance.Service,
                Maintenance.Description,
                Maintenance.Status,
                Maintenance.Created_at,
                Maintenance.Status,
                Maintenance.Service, 
                Staff.First_name || ' ' || Staff.Last_name AS StaffName,
                Staff.Phone AS StaffNumber,
                Users.First_name || ' ' || Users.Last_name AS OwnerName,
                Users.Phone AS OwnerPhone
            FROM Maintenance
            JOIN Lease_Agreement ON Maintenance.Lease_ID = Lease_Agreement.Lease_ID
            JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
            JOIN Users ON Property.Owner_ID = Users.User_ID
            LEFT JOIN Users AS Staff ON Maintenance.Staff_ID = Staff.User_ID
            WHERE Property.Owner_ID = $1;
        `;
  
        const adminRequestsRes = await pool.query(adminRequestsQuery, [userId]);
        const adminRequests = adminRequestsRes.rows;
  
        return new Response(JSON.stringify({ adminRequests }), {
            headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        return new Response('Error fetching  maintenance requests', { status: 500 });
    }
  }

  export async function PATCH(request: Request) {
    try {
        const { request_id, newStatus } = await request.json();
        console.log(request_id, newStatus)
        
        if (!request_id || !newStatus) {
            return new Response('Missing parameters', { status: 400 });
        }

        const updateQuery = `
            UPDATE Maintenance
            SET Status = $1
            WHERE Request_ID = $2
            RETURNING *;
        `;

        const result = await pool.query(updateQuery, [newStatus, request_id]);

        if (result.rowCount === 0) {
            return new Response('Request not found', { status: 404 });
        }

        return new Response(JSON.stringify(result.rows[0]), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error updating maintenance request status:', error);
        return new Response('Error updating status', { status: 500 });
    }
}
