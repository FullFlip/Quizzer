import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Review = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const location = useLocation();


    // Explicitly check for undefined and ensure the state is correctly interpreted
    const showAddReviewForm = location.state?.showAddReviewForm ?? true;

    interface Review {
        id: number;
        comment: string;
        reviewValue: number;
        nickname: string;
    }

    interface Quiz {
        title: string;
        description: string;
    }

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ comment: "", reviewValue: 0, nickname: "" });
    const [editingReview, setEditingReview] = useState<any>(null);

    useEffect(() => {
        // Fetch quiz details
        fetch(`/quiz/${quizId}`)
            .then((response) => response.json())
            .then((data) => setQuiz(data))
            .catch((error) => console.error("Error fetching quiz details:", error));

        // Fetch reviews for the quiz
        fetch(`/reviews/quiz/${quizId}`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error("Error fetching reviews:", error));
    }, [quizId]);

    const handleAddReview = () => {
        if (newReview.reviewValue < 0 || newReview.reviewValue > 5) {
            alert("Rating must be between 0 and 5.");
            return;
        }
        fetch(`/reviews/quiz/${quizId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReview),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setReviews((prev) => [...prev, data]))
            .catch((error) => console.error("Error adding review:", error));
    };

    const handleEditReview = (review: any) => {
        setEditingReview({ ...review });
    };

    const handleSaveEdit = () => {
        if (!editingReview) return;

        // Ensure all required fields are present
        if (!editingReview.comment || editingReview.reviewValue < 0 || editingReview.reviewValue > 5) {
            alert("Please provide a valid comment and rating between 0 and 5.");
            return;
        }

        fetch(`/reviews/${editingReview.id}/quiz/${quizId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                comment: editingReview.comment,
                reviewValue: editingReview.reviewValue,
                nickname: editingReview.nickname || "Anonymous", // Default to "Anonymous" if nickname is empty
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === editingReview.id ? { ...review, ...editingReview } : review
                    )
                );
                setEditingReview(null);
            })
            .catch((error) => console.error("Error editing review:", error));
    };

    const handleDeleteReview = (reviewId: number) => {
        if (!window.confirm("Are you sure you want to delete the review?")) {
            return;
        }


        fetch(`/reviews/${reviewId}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setReviews((prev) => prev.filter((review) => review.id !== reviewId));
            })
            .catch((error) => console.error("Error deleting review:", error));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-600 transition"
            >
                Back
            </button>
            {quiz && (
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">Reviews of {quiz.title}</h1>
                    <p className="text-gray-700">{quiz.description}</p>
                    <p className="text-gray-700">
                        {reviews.length > 0
                            ? `${(reviews.reduce((sum, review) => sum + review.reviewValue, 0) / reviews.length).toFixed(1)} rating average based on ${reviews.length} reviews`
                            : "No reviews yet"}
                    </p>
                </div>
            )}
            {showAddReviewForm && (
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={newReview.nickname}
                        onChange={(e) => setNewReview({ ...newReview, nickname: e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                    />
                    <select
                        title="Rating"
                        value={newReview.reviewValue}
                        onChange={(e) => setNewReview({ ...newReview, reviewValue: +e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full mb-4"
                    >
                        <option value="" disabled>Select Rating (0-5)</option>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
                    >
                        Add Review
                    </button>
                </div>
            )}

            {editingReview && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50"
                    style={{ backgroundColor: "rgba(128, 128, 128, 0.2)" }} // Light grey with 20% opacity
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Review</h2>
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={editingReview.nickname}
                            onChange={(e) =>
                                setEditingReview({ ...editingReview, nickname: e.target.value })
                            }
                            className="border border-gray-300 p-2 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Comment"
                            value={editingReview.comment}
                            onChange={(e) =>
                                setEditingReview({ ...editingReview, comment: e.target.value })
                            }
                            className="border border-gray-300 p-2 rounded w-full mb-2"
                        />
                        <select
                            title="Rating"
                            value={editingReview.reviewValue}
                            onChange={(e) =>
                                setEditingReview({ ...editingReview, reviewValue: +e.target.value })
                            }
                            className="border border-gray-300 p-2 rounded w-full mb-4"
                        >
                            <option value="" disabled>Select Rating (0-5)</option>
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleSaveEdit}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingReview(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ul className="space-y-4">
                {reviews.map((review: any) => (
                    <li key={review.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                        <p className="font-semibold text-lg mb-1">
                            <strong>Nickname:</strong> {review.nickname || "Anonymous"}
                        </p>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-gray-600 mb-4">Rating: {review.reviewValue}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleEditReview(review)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Review;
