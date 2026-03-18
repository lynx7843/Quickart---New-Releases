import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/virtual-tryon", async (req, res) => {
  try {
    const { userImage, clothImage } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c221b2b8ef52798806d6c7c5c3a1a996a96f2ef749acd972d4b8ca0d24dd47ce", // example model
        input: {
          person_image: userImage,
          garment_image: clothImage,
        },
      }),
    });

    const prediction = await response.json();

    // Poll until completed
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((r) => setTimeout(r, 2000));

      const poll = await fetch(result.urls.get, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      result = await poll.json();
    }

    if (result.status === "succeeded") {
      res.json({ image: result.output[0] });
    } else {
      res.status(500).json({ error: "AI generation failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));