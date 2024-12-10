import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useParams } from "react-router-dom"; // To get the dynamic product id from the URL
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";

const ProductDetailsPage = () => {
  const { id } = useParams(); // This will get the product id from the URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch the logged-in userId from localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    if (storedUserId) {
      setUserId(storedUserId); // Set userId in the state
    }
  }, []);

  // Fetch reviews when the page loads or when the product id changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/reviews/products/${id}`);
        setReviews(response.data);
      } catch (err) {
        setError("Error fetching reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Add a new review
  const handleAddReview = async (newReview) => {
    if (!userId) {
      setError("User is not logged in");
      return;
    }

    try {
      const reviewData = {
        userId: userId,
        dishId: id, // Use the product id (from URL) as productId
        rating: newReview.rating,
        comment: newReview.comment,
      };
      
      console.log(reviewData);
      
      // Send the review data to the backend to save the new review
      // const response = await axios.post(`/reviews/products/${id}`, reviewData);
      await axios.post(`/reviews/products/${id}`, reviewData);

      // Re-fetch reviews to include the newly added one
      const response = await axios.get(`/reviews/products/${id}`);
      setReviews(response.data);
      setIsFormOpen(false); // Close the form after successful submission

      // Add the newly created review to the list
      // setReviews((prevReviews) => [...prevReviews, response.data]);
      // setIsFormOpen(false); // Close the form after successful submission
      // window.location.reload();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Error adding review. Please try again later.");
    }
  };

  // Handle review update
  const handleUpdateReview = (updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };

  // Handle review delete
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId)); // Remove the review from the list
    } catch (err) {
      setError("Error deleting review. Please try again later.");
    }
  };

  if (loading) return <p className="text-lg text-white">Loading reviews...</p>;
  if (error) return <p className="text-lg text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Product Reviews</h1>

      {/* Add Review Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add Review
      </button>

      {/* Show Review Form if it's open */}
      {isFormOpen && (
        <ReviewForm
          productId={id}
          userId={userId} 
          onSubmit={handleAddReview}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {reviews.length === 0 ? (
        <p className="text-lg text-gray-400">No reviews yet</p>
      ) : (
        <ul className="space-y-8">
          {reviews.map((review) => (
            <li key={review._id}>
              <ReviewCard 
                review={review} 
                currentUserId={userId}
                onReviewUpdate={handleUpdateReview}
              />
              {/* If the current user is the author of the review, show the delete button */}
              {userId === review.userId._id && (
                <button
                  onClick={() => handleDeleteReview(review._id)}  // Ensure deletion uses _id or correct key
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Delete Review
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductDetailsPage;
