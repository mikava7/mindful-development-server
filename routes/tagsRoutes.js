import express from "express";
import { getAllTags, getLastFiveTags } from "../controllers/PostController.js";

const router = express.Router();

router.get("/tags", getAllTags);
router.get("/tags/last5", getLastFiveTags);

export default router;
