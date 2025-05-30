import express from "express";
import User from "../models/User.js";

const clerkWebhooks = express.Router();

clerkWebhooks.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const payload = JSON.parse(req.body.toString());
      const eventType = payload.type;

      console.log(`Webhook received: ${eventType}`);

      if (eventType === "user.created") {
        const { id, username, email_addresses, image_url } = payload.data;

        // Create a new user in the database
        await User.create({
          _id: id,
          username: username || email_addresses[0].email_address.split("@")[0],
          email: email_addresses[0].email_address,
          image: image_url,
        });

        console.log(`User created: ${id}`);
      } else if (eventType === "user.updated") {
        const { id, username, email_addresses, image_url } = payload.data;

        // Update the user in the database
        await User.findByIdAndUpdate(id, {
          username: username || email_addresses[0].email_address.split("@")[0],
          email: email_addresses[0].email_address,
          image: image_url,
        });

        console.log(`User updated: ${id}`);
      } else if (eventType === "user.deleted") {
        const { id } = payload.data;

        // Delete the user from the database
        await User.findByIdAndDelete(id);

        console.log(`User deleted: ${id}`);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
);

export default clerkWebhooks;
