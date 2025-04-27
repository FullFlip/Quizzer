import { useEffect, useState } from 'react';

type CategoryType = {
    categoryId: number; // Updated to match the backend's property name
    title: string;      // Updated to match the backend's property name
};



const Categories = () => {
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
                console.log(data);
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

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

    // New: Handle category deletion
    const handleDeleteCategory = (categoryId: number) => {
        fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Update state after deletion
                setCategories(categories.filter(category => category.categoryId !== categoryId));
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
            });
    };




    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="mb-4">
                {categories.map((category) => (
                    <li key={category.categoryId} className="flex items-center gap-4 text-lg">
                        <button
                            onClick={() => handleDeleteCategory(category.categoryId)}
                            className="bg-red-500 text-white px-4 my-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <span>{category.title}</span>
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
