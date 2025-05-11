import { useEffect, useState } from 'react';

type CategoryType = {
    categoryId: number;
    title: string;
    description?: string;
};

type CategoriesProps = {
    onCategorySelect: (categoryId: number | null) => void; // New prop to pass selected categoryId
    selectedCategoryId: number | null;
};

const Categories = ({ onCategorySelect, selectedCategoryId }: CategoriesProps) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');

    const fetchCategories = () => {
        fetch(`http://localhost:8080/categories`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) {
            alert("Category name cannot be empty.");
            return;
        }


        const duplicateCategory = categories.find(
            (category) => category.title.toLowerCase() === newCategoryName.toLowerCase()
        );

        if (duplicateCategory) {
            alert("A category with this name already exists.");
            return;
        }

        fetch("http://localhost:8080/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Explicitly set without charset
            },
            body: JSON.stringify({
                title: newCategoryName,
                description: newCategoryDescription || "",
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((createdCategory) => {
                setCategories([...categories, createdCategory]);
                setNewCategoryName('');
                setNewCategoryDescription('');
            })
            .catch((error) => {
                console.error("Error adding category:", error);
            });
    };

    const handleDeleteCategory = (categoryId: number) => {
        const confirmDeletion = window.confirm("Are you sure you want to save changes to this quiz?");
        if (!confirmDeletion) {
            return; // Exit if the user cancels
        }

        fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setCategories(categories.filter(category => category.categoryId !== categoryId));
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
            });
    };

    const handleCategoryClick = (categoryId: number | null) => {
        onCategorySelect(categoryId); // Pass the selected categoryId to the parent
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
            {selectedCategoryId === null
                ? "Categories"
                : `Category selected: ${categories.find(cat => cat.categoryId === selectedCategoryId)?.title || "Unknown"}`
            }
        </h2>
            <ul className="mb-4">
                {/* "All" Button */}
                <li
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer`}
                    onClick={() => handleCategoryClick(null)} // Clear the selected category
                >
                    <span>All</span>
                </li>
                {categories.map((category) => (
                    <li
                        key={category.categoryId}
                        className={`flex items-center gap-4 my-2 p-4 border-b border-gray-200 rounded-lg ${selectedCategoryId === category.categoryId ? "bg-blue-100" : "bg-white"
                            }`}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering category selection
                                handleDeleteCategory(category.categoryId);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleCategoryClick(category.categoryId)}
                        >
                            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                                {category.title}
                            </h2>
                            <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="border rounded-lg p-2 flex-1 text-center"
                />
                <input
                    type="text"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="New category description"
                    className="border rounded-lg p-2 flex-2 text-center"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default Categories;
