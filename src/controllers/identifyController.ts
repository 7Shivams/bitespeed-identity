import { Request, Response } from "express";
import { pool } from "../server";
import { Contact } from "../utils";

export const identify = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    res.status(400).json({ error: "email or phoneNumber is required" });
    return;
  }

  try {
    const client = await pool.connect();

    const result = await client.query<Contact>(
      `SELECT * FROM "Contact" WHERE email = $1 OR phoneNumber = $2`,
      [email, phoneNumber]
    );

    const contacts = result.rows;
    let primary: Contact | null = null;
    let secondaryIds: number[] = [];
    const allEmails = new Set<string>();
    const allPhones = new Set<string>();

    if (contacts.length === 0) {
      const insertResult = await client.query<Contact>(
        `INSERT INTO "Contact" (email, phoneNumber, linkPrecedence)
         VALUES ($1, $2, 'primary') RETURNING *`,
        [email, phoneNumber]
      );
      primary = insertResult.rows[0];
    } else {
      primary =
        contacts.find((c) => c.linkPrecedence === "primary") ?? contacts[0];

      contacts.forEach((c) => {
        if (c.email) allEmails.add(c.email);
        if (c.phoneNumber) allPhones.add(c.phoneNumber);
        if (c.id !== primary!.id) secondaryIds.push(c.id);
      });

      const existingEmails = contacts.map((c) => c.email);
      const existingPhones = contacts.map((c) => c.phoneNumber);

      const isNewEmail = email && !existingEmails.includes(email);
      const isNewPhone = phoneNumber && !existingPhones.includes(phoneNumber);

      if (isNewEmail || isNewPhone) {
        const insertSecondary = await client.query(
          `INSERT INTO "Contact" (email, phoneNumber, linkPrecedence, linkedId)
           VALUES ($1, $2, 'secondary', $3) RETURNING id`,
          [email, phoneNumber, primary.id]
        );
        secondaryIds.push(insertSecondary.rows[0].id);
        if (email) allEmails.add(email);
        if (phoneNumber) allPhones.add(phoneNumber);
      }
    }

    const emails = [primary.email, ...[...allEmails].filter((e) => e !== primary?.email)];
    const phones = [primary.phoneNumber, ...[...allPhones].filter((p) => p !== primary?.phoneNumber)];

    client.release();

    res.status(200).json({
      contact: {
        primaryContatctId: primary.id,
        emails,
        phoneNumbers: phones,
        secondaryContactIds: secondaryIds,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};