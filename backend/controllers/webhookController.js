import { Webhook } from "svix";
import dotenv from "dotenv";
import User from "../models/user.js"; // adjust the import path
dotenv.config();

export const webhookController = async (req, res) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET missing");
    return res.status(500).send("Server misconfigured");
  }

  // Get headers from Express request
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Missing Svix headers");
  }

  // Get raw body (you must use bodyParser.raw in Express for this route)
  const payload = req.body;
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
    console.error("❌ Error verifying webhook:", err);
    return res.status(400).send("Invalid signature");
  }

  const eventType = evt.type;
  const data = evt.data;

  try {
    if (eventType === "user.created") {
      const { id, first_name, last_name, email_addresses, image_url } = data;
      const email = email_addresses[0]?.email_address;

      // Create new user if not exists
      const existingUser = await User.findOne({ clerkId: id });
      if (!existingUser) {
        await User.create({
          clerkId: id,
          firstName: first_name || "",
          lastName: last_name || "",
          email,
          profilePicture: image_url || "",
        });
        console.log("✅ User created:", email);
      }
    }

    if (eventType === "user.updated") {
      const { id, first_name, last_name, email_addresses, image_url } = data;
      const email = email_addresses[0]?.email_address;

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: first_name || "",
          lastName: last_name || "",
          email,
          profilePicture: image_url || "",
        },
        { new: true }
      );
      console.log("🔄 User updated:", email);
    }

    if (eventType === "user.deleted") {
      const { id } = data;
      await User.findOneAndDelete({ clerkId: id });
      console.log("🗑️ User deleted:", id);
    }

    return res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("🔥 Error handling webhook event:", error);
    return res.status(500).send("Internal error handling event");
  }
};
