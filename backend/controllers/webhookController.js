import { Webhook } from "svix";
import dotenv from "dotenv";
dotenv.config();

export const webhookController = async (req, res) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET missing");
    return res.status(500).send("Server misconfigured");
  }

  //  Get headers from Express request
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Missing Svix headers");
  }

  //  Get raw body (IMPORTANT for Svix verification)
  const payload = req.body; // ensure body-parser is not converting to object
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error(" Error verifying webhook:", err);
    return res.status(400).send("Invalid signature");
  }

  const eventType = evt.type;
  const data = evt.data;

  console.log(` Webhook received: ${eventType}`, data);

  try {
    if (eventType === "user.created") {
      console.log("User created:", data.id);
      // Add logic to store user in DB
    } else if (eventType === "user.updated") {
      console.log("User updated:", data.id);
      // Add logic to update user in DB
    } else if (eventType === "user.deleted") {
      console.log("User deleted:", data.id);
      // Add logic to delete user in DB
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return res.status(500).send("Internal error handling event");
  }

  return res.status(200).send("Webhook processed successfully");
};
