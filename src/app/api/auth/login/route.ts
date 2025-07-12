import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(request: Request) {
  const {email, password, role}=await request.json();

  try {
    const result=await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    let i=0;
    for(;i<result.rows.length;i++){
        const getRole=await pool.query('SELECT Role FROM Roles WHERE User_ID = $1', [result.rows[i].user_id]);
        if(getRole.rows[0].role===role){
            break;
        }
    }

    if(i === result.rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[i];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    const token = jwt.sign({ userId: user.user_id, email: user.email, role }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ message: 'Login successful', token, role }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
