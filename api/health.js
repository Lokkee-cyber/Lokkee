import clientPromise from "./lib/mongodb.js";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;

    await client.db("toolpilot").command({
      ping: 1,
    });

    res.status(200).json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
    });
  }
}