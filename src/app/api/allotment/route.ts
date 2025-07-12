import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const req = await request.json();
    console.log(req)

    if (!req.property_id || !req.tenant_id || !req.start_date || !req.end_date || !req.price) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = request.headers.get('User_ID');
    if (!userId) {
        return new Response(
            JSON.stringify({ message: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [userId]);
        if (userResult.rowCount === 0) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = userResult.rows[0];

        const roleResult = await pool.query('SELECT Role FROM Roles WHERE User_ID = $1', [userId]);
        const role = roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

        if (role !== 'Admin') {
            return new Response(
                JSON.stringify({ message: 'User is not an Admin' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await pool.query('BEGIN');
        
        const leaseResult = await pool.query(
            'INSERT INTO Lease_Agreement (Property_ID, Tenant_ID, Start_date, End_date, Renewed, Price, Advance_amount, Status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING Lease_ID',
            [
                req.property_id,
                req.tenant_id,
                req.start_date,
                req.end_date,
                req.renewed || 'NO',
                req.price,
                req.advance_amount || 0,
                req.status || 'active'
            ]
        );
        
        const leaseId = leaseResult.rows[0].Lease_ID;

        const updatePropertyQuery = `
            UPDATE Property
            SET Availability = $1
            WHERE Property_ID = $2
            RETURNING *
        `;

        const updatedProperty = await pool.query(updatePropertyQuery, ['Leased', req.property_id]);

        await pool.query('COMMIT');

        return NextResponse.json(
            { message: 'Lease agreement created and property status updated successfully', leaseId, property: updatedProperty.rows[0] },
            { status: 201 }
        );
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        return NextResponse.json({ error: 'Error creating lease agreement and updating property status' }, { status: 500 });
    }
}
