import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(request: Request) {
  const req = await request.json();
  if (!req.first_name || !req.last_name || !req.email || !req.password || !req.phone || !req.role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }  

  const hashedPassword = await bcrypt.hash(req.password, 10);
  if(req.role==="Tenant"){
    try {
      await pool.query('BEGIN');

      const result = await pool.query(
        'INSERT INTO Users (First_name, Middle_name, Last_name, Email, Phone, Password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING User_ID',
        [req.first_name, req.middle_name, req.last_name, req.email, req.phone, hashedPassword]
      );

      const userId = result.rows[0].user_id;

      await pool.query(
        'INSERT INTO Roles (User_ID, Role) VALUES ($1, $2)',
        [userId, req.role]
      );

      await pool.query('COMMIT');

      const token = jwt.sign({ userId: userId, email: req.email, role: req.role }, SECRET_KEY, { expiresIn: '1h' });

      return NextResponse.json({ message: 'User registered successfully', token, role:req.role }, { status: 201 });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
    }
  }
  else if(req.role==="Admin"){
    try {
      await pool.query('BEGIN');

      const result = await pool.query(
        'INSERT INTO Users (First_name, Middle_name, Last_name, Email, Phone, Password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING User_ID',
        [req.first_name, req.middle_name, req.last_name, req.email, req.phone, hashedPassword]
      );

      const userId = result.rows[0].user_id;

      await pool.query(
        'INSERT INTO Roles (User_ID, Role) VALUES ($1, $2)',
        [userId, req.role]
      );

      await pool.query(
        'INSERT INTO Admins (User_ID, UPI_ID, Account_no, IFSC_code, Bank_name, Bank_Branch, Account_holder_name) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, req.upi_id, req.account_no, req.ifsc_code, req.bank_name, req.bank_branch, req.account_holder_name]
      );

      await pool.query('COMMIT');

      const token = jwt.sign({ userId: userId, email: req.email, role: req.role }, SECRET_KEY, { expiresIn: '1h' });

      return NextResponse.json({ message: 'User registered successfully', token, role:req.role }, { status: 201 });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
    }
  }
  else if(req.role==="Staff"){
    try {
      await pool.query('BEGIN');

      const result = await pool.query(
        'INSERT INTO Users (First_name, Middle_name, Last_name, Email, Phone, Password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING User_ID',
        [req.first_name, req.middle_name, req.last_name, req.email, req.phone, hashedPassword]
      );

      const userId = result.rows[0].user_id;

      await pool.query(
        'INSERT INTO Roles (User_ID, Role) VALUES ($1, $2)',
        [userId, req.role]
      );

      await pool.query(
        'INSERT INTO Staff (User_ID, Service, UPI_ID, Account_no, IFSC_code, Bank_name, Bank_Branch, Account_holder_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [userId, req.service, req.upi_id, req.account_no, req.ifsc_code, req.bank_name, req.bank_branch, req.account_holder_name]
      );

      await pool.query('COMMIT');

      const token = jwt.sign({ userId: userId, email: req.email, role: req.role }, SECRET_KEY, { expiresIn: '1h' });

      return NextResponse.json({ message: 'User registered successfully', token, role:req.role }, { status: 201 });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
    }
  }
}

