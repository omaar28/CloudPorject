import * as reviewService from "../services/review.service.js";

// Get all reviews for a specific dish
export const getReviews = async (req, res) => {
  try {
    const { dishId } = req.params; // Extract dishId from route parameters
    const reviews = await reviewService.getReviewsByDishId(dishId);

    // if (!reviews.length) {
    //   return res.status(404).json({ message: "No reviews found for this dish." });
    // }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getReviews controller:", error.message); 
    res.status(500).json({ message: `Error fetching reviews: ${error.message}` });
  }
};

// Add a new review
export const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  console.log("AAAAAAAAAAAAAAAA");

  const { reviewId } = req.params;
  const { rating, comment, userId } = req.body;

  try {
    // First check if the review exists and belongs to the user
    const existingReview = await reviewService.getReviewById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // // Check if the user is the owner of the review
    // if (existingReview.userId.toString() !== userId) {
    //   return res.status(403).json({ message: "Not authorized to edit this review" });
    // }

    // Update the review
    const updatedReview = await reviewService.updateReview(reviewId, { rating, comment });
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const result = await reviewService.deleteReview(reviewId);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
