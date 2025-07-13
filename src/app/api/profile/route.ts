import pool from '@/lib/db';

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

    if (role === 'Admin') {
      const adminResult = await pool.query(
        'SELECT * FROM Admins WHERE User_ID = $1',
        [userId]
      );
      const adminDetails = adminResult.rows.length > 0 ? adminResult.rows[0] : null;
      return new Response(JSON.stringify({user, role, adminDetails}), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    else if (role === 'Staff') {
      const staffResult = await pool.query(
        'SELECT * FROM Staff WHERE User_ID = $1',
        [userId]
      );
      const staffDetails = staffResult.rows.length > 0 ? staffResult.rows[0] : null;
      return new Response(JSON.stringify({user, role, staffDetails}), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({user, role}), {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response('Error fetching profile', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = parseInt(request.headers.get('User_ID') || '');

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
    
    const requestBody = await request.json();
    console.log(requestBody);
    if (role === 'Admin') {
      const adminColumns = [
        'upi_id',
        'account_no',
        'ifsc_code',
        'bank_name',
        'bank_Branch',
        'account_holder_name'
      ];
      const adminUpdateFields = Object.keys(requestBody)
        .filter((key) => adminColumns.includes(key))
        .reduce((obj:{ [key: string]: string | number }, key) => {
          obj[key] = requestBody[key];
          return obj;
        }, {} as { [key: string]: string | number });
      const updateColumns = Object.keys(adminUpdateFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
      const updateValues = Object.values(adminUpdateFields);
      console.log([...updateValues, userId])
      await pool.query(
        `UPDATE Admins SET ${updateColumns} WHERE User_ID = $${updateValues.length + 1}`,
        [...updateValues, userId]
      );
    }
    else if (role === 'Staff') {
      const staffColumns = [
        'upi_id',
        'account_no',
        'ifsc_code',
        'bank_name',
        'bank_Branch',
        'account_holder_name'
      ];
      const staffUpdateFields = Object.keys(requestBody)
        .filter((key) => staffColumns.includes(key))
        .reduce((obj:{ [key: string]: string }, key) => {
          obj[key] = requestBody[key];
          return obj;
        }, {});
        const updateColumns = Object.keys(staffUpdateFields)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(', ');
        const updateValues = Object.values(staffUpdateFields);
      await pool.query(
        `UPDATE Staff SET ${updateColumns} WHERE User_ID = $${updateValues.length + 1}`,
        [...updateValues, userId]
      );
    }
    const userColumns = [
      'first_name',
      'middle_name',
      'last_name',
      'phone',
      'email',
    ];
    const userUpdateFields = Object.keys(requestBody)
      .filter((key) => userColumns.includes(key))
      .reduce((obj:{ [key: string]: string }, key) => {
        obj[key] = requestBody[key];
        return obj;
      }, {});
    const updateColumns = Object.keys(userUpdateFields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const updateValues = Object.values(userUpdateFields);

    await pool.query(
      `UPDATE Users SET ${updateColumns} WHERE User_ID = $${updateValues.length + 1}`,
      [...updateValues, userId]
    );
    return new Response('Profile updated', {
      headers: { 'Content-Type': 'application/json' },
    });
  }catch (error) {
    console.error('Error updating profile:', error);
    return new Response('Error updating profile', { status: 500 });
  }
}
