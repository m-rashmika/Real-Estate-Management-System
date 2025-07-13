import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
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

    if (role != 'Tenant') {
      return new Response( JSON.stringify({ message: 'User is not a Tenant' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const currentRentalsQuery = `
      SELECT
        Lease_Agreement.Lease_ID, Property.Property_ID, Property.Building_name, Property.Type,
        Lease_Agreement.Start_date, Lease_Agreement.End_date,
        Users.First_name as OwnerName, Users.Phone as OwnerPhone
      FROM Lease_Agreement
      JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
      JOIN Users ON Property.Owner_ID = Users.User_ID
      WHERE Lease_Agreement.Status = 'active'
      AND Lease_Agreement.Tenant_ID = $1
    `;

    const pastRentalsQuery = `
      SELECT
        Lease_Agreement.Lease_ID, Property.Property_ID, Property.Building_name, Property.Type,
        Lease_Agreement.Start_date, Lease_Agreement.End_date,
        Users.First_name as OwnerName, Users.Phone as OwnerPhone
      FROM Lease_Agreement
      JOIN Property ON Lease_Agreement.Property_ID = Property.Property_ID
      JOIN Users ON Property.Owner_ID = Users.User_ID
      WHERE Lease_Agreement.Status = 'expired'
      AND Lease_Agreement.Tenant_ID = $1
    `;


    const [currentRentalsRes, pastRentalsRes] = await Promise.all([
        pool.query(currentRentalsQuery, [userId]),
        pool.query(pastRentalsQuery, [userId]),
      ]);

    const currentRentals = currentRentalsRes.rows;
    const pastRentals = pastRentalsRes.rows;

    return new Response(JSON.stringify({currentRentals, pastRentals}), {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching rentals' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}