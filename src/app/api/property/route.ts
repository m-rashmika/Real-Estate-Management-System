import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('User_ID');
    if (!userId) {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
      }
      const propertyQuery = `
        SELECT * 
        FROM Property 
        WHERE Property_ID = $1
      `;
      const { rows: propertyRows } = await pool.query(propertyQuery, [id]);

      if (propertyRows.length === 0) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
      }

      const property = propertyRows[0];

      let propertyDetails = {};

      if (property.Type === 'Residential Building') {
        const residentialQuery = `
          SELECT * 
          FROM Residential_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: residentialRows } = await pool.query(residentialQuery, [id]);
        propertyDetails = residentialRows[0] || {};
      }
      else if (property.Type === 'Commercial Building') {
        const commercialQuery = `
          SELECT * 
          FROM Commercial_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: commercialRows } = await pool.query(commercialQuery, [id]);
        propertyDetails = commercialRows[0] || {};
      }
      else if (property.Type === 'Land') {
        const landQuery = `
          SELECT * 
          FROM Plot_lands 
          WHERE Property_ID = $1
        `;
        const { rows: landRows } = await pool.query(landQuery, [id]);
        propertyDetails = landRows[0] || {};
      }
      return NextResponse.json({...property, ...propertyDetails});
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

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }
    if (role === 'Tenant') {
      const propertyQuery = `
        SELECT * 
        FROM Property 
        WHERE Property_ID = $1
      `;
      const { rows: propertyRows } = await pool.query(propertyQuery, [id]);

      if (propertyRows.length === 0) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
      }

      const property = propertyRows[0];

      let propertyDetails = {};

      if (property.Type === 'Residential Building') {
        const residentialQuery = `
          SELECT * 
          FROM Residential_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: residentialRows } = await pool.query(residentialQuery, [id]);
        propertyDetails = residentialRows[0] || {};
      }
      else if (property.Type === 'Commercial Building') {
        const commercialQuery = `
          SELECT * 
          FROM Commercial_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: commercialRows } = await pool.query(commercialQuery, [id]);
        propertyDetails = commercialRows[0] || {};
      }
      else if (property.Type === 'Land') {
        const landQuery = `
          SELECT * 
          FROM Plot_lands 
          WHERE Property_ID = $1
        `;
        const { rows: landRows } = await pool.query(landQuery, [id]);
        propertyDetails = landRows[0] || {};
      }

      const enquiryQuery = `
        SELECT Approval
        FROM Enquiry
        WHERE Property_ID = $1
        AND Tenant_ID=$2
      `;
      const { rows: enquiryRows } = await pool.query(enquiryQuery, [id, userId]);
      const enquiries = enquiryRows[0] || "";

      const combinedDetails = { ...property, ...propertyDetails, enquiries };

      return NextResponse.json(combinedDetails);
    }
    else if (role === 'Admin') {
      const propertyQuery = `
        SELECT * 
        FROM Property 
        WHERE Property_ID = $1
      `;
      const { rows: propertyRows } = await pool.query(propertyQuery, [id]);

      if (propertyRows.length === 0) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
      }

      const property = propertyRows[0];

      let propertyDetails = {};

      if (property.Type === 'Residential Building') {
        const residentialQuery = `
          SELECT * 
          FROM Residential_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: residentialRows } = await pool.query(residentialQuery, [id]);
        propertyDetails = residentialRows[0] || {};
      }
      else if (property.Type === 'Commercial Building') {
        const commercialQuery = `
          SELECT * 
          FROM Commercial_buildings 
          WHERE Property_ID = $1
        `;
        const { rows: commercialRows } = await pool.query(commercialQuery, [id]);
        propertyDetails = commercialRows[0] || {};
      }
      else if (property.Type === 'Land') {
        const landQuery = `
          SELECT * 
          FROM Plot_lands 
          WHERE Property_ID = $1
        `;
        const { rows: landRows } = await pool.query(landQuery, [id]);
        propertyDetails = landRows[0] || {};
      }
      const enquiryQuery = `
        SELECT 
          Users.First_name||' '||Users.Last_name AS Tenant_name,
          Enquiry.Tenant_ID
      FROM 
          Enquiry
      JOIN 
          Users ON Enquiry.Tenant_ID = User_ID
      WHERE 
          Enquiry.Property_ID = $1
          AND Enquiry.Approval = 'Approved';
      `;
      const { rows: enquiryRows } = await pool.query(enquiryQuery, [id]);
      const enquiries = enquiryRows || "";

      const combinedDetails = { ...property, ...propertyDetails, enquiries };

      return NextResponse.json(combinedDetails);

    }


  } catch (error) {
    console.error("Error fetching property details:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
