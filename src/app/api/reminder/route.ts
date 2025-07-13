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
            const remindersResult = await pool.query('SELECT * FROM get_lease_payment_reminders($1)', [userId]);
            const reminders=remindersResult.rows;
            return new Response(
                JSON.stringify({ reminders }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
        else if(role === 'Admin'){
            const result = await pool.query('SELECT * FROM get_admin_pending_maintenance_payments($1)', [userId]);

            const reminders = result.rows;
            return new Response(
                JSON.stringify({ reminders }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );

        }
    }
    catch (error) {
        console.error("Error fetching reminders:", error);
        return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}