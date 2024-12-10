import { Types } from "mongoose";
import ReviewModel from "../models/review.model.js";

const { ObjectId } = Types;

// Get all reviews for a specific dish
export const getReviewsByDishId = async (dishId) => {
  try {
    console.log("Fetching reviews for dishId:", dishId); // Log the dishId
    const reviews = await ReviewModel.find({ dishId }).populate("userId");
    return reviews;
  } catch (err) {
    console.error(`Error retrieving reviews for dishId: ${dishId}:, err.message`); // Log the error
    throw new Error(
      `Error retrieving reviews for dish with ID: ${dishId}. ${err.message}`
    );
  }
};

// Add a new review
export const addReview = async (reviewData) => {
  try {
    const review = new ReviewModel(reviewData);
    return await review.save();
  } catch (err) {
    throw new Error("Error adding review: ${err.message}");
  }
};

// Delete a review by ID
export const deleteReview = async (reviewId) => {
  try {
    const result = await ReviewModel.deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) {
      throw new Error("Review with ID: ${reviewId} not found.");
    }
    return result;
  } catch (err) {
    throw new Error(
      "Error deleting review with ID: ${reviewId}. ${err.message}"
    );
  }
};

// Update a review by ID
export const updateReview = async (reviewId, updateData) => {
  try {
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { $set: updateData },
      { new: true } // This option ensures the updated document is returned
    );

    console.log("AAAAAAAAAAAAAAAA");

    if (!updatedReview) {
      throw new Error(`Review with ID: ${reviewId} not found.`);
    }

    return updatedReview;
  } catch (err) {
    throw new Error(`Error updating review with ID: ${reviewId}. ${err.message}`);
  }
};

// Get a review by ID
export const getReviewById = async (reviewId) => {
  try {
    // Make sure the reviewId is a valid ObjectId
    if (!ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID.");
    }

    // Retrieve the review from the database
    const review = await ReviewModel.findById(reviewId).populate("userId");

    if (!review) {
      throw new Error(`Review with ID: ${reviewId} not found.`);
    }

    return review;
  } catch (err) {
    throw new Error(`Error retrieving review with ID: ${reviewId}. ${err.message}`);
  }
};