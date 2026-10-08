import express from "express";
import Article from "../models/Article.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .populate("author")
      .populate("category");

    res.json(articles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch articles",
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .populate("author")
      .populate("category");

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch article",
    });
  }
});

export default router;