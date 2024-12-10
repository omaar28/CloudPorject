import { Router } from "express";
import * as reviewsController from "../controllers/review.controller.js";

const reviewsRouter = Router();

// Route to get all reviews for a specific dish
reviewsRouter.get("/products/:dishId", reviewsController.getReviews);

// Route to add a new review
reviewsRouter.post("/products/:dishId", reviewsController.addReview);

// Route to update a review
reviewsRouter.put("/:reviewId", reviewsController.updateReview);

// Route to delete a review by its ID
reviewsRouter.delete("/:reviewId", reviewsController.deleteReview);

export default reviewsRouter;
