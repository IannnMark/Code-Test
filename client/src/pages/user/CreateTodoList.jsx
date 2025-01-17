import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function CreateTodoList() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todoImages, setTodoImages] = useState([]);
  const [todoImagesPreview, setTodoImagesPreview] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    tasks: [],
  });
  const [taskDescription, setTaskDescription] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleTaskChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleAddTask = () => {
    if (taskDescription.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        tasks: [...prevData.tasks, { description: taskDescription }],
      }));
      setTaskDescription("");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Images must be less than 5MB each.");
      return;
    }

    setError(null);
    setTodoImages(files);
    setTodoImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    setTodoImages((prev) => prev.filter((_, i) => i !== index));
    setTodoImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("userRef", currentUser._id);

    formData.tasks.forEach((task) => {
      formPayload.append("tasks", JSON.stringify(task));
    });

    todoImages.forEach((image) => {
      formPayload.append("imageUrls", image);
    });

    try {
      const res = await fetch(`/api/todo/todo/new`, {
        method: "POST",
        credentials: "include",
        body: formPayload,
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        alert("Todo created successfully");
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="To Do List Title"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-2 py-2 text-[70px] font-normal border-b-2"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex-none w-16">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold"
              />
            </div>

            <div className="flex-grow">
              <input
                id="taskDescription"
                type="text"
                value={taskDescription}
                onChange={handleTaskChange}
                placeholder="Enter task task"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-2 py-2 text-[30px] font-normal border-b-2"
              />
            </div>

            <div className="bg-blue-950 rounded-full h-10 w-10 flex items-center justify-center">
              <PlusIcon
                onClick={handleAddTask}
                className="h-5 w-5 text-white"
              />
            </div>

            <div className="flex gap-4 mb-4">
              {todoImagesPreview.map((preview, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-medium text-black">Tasks</h2>
            <ul className="list-disc pl-5 mt-2">
              {formData.tasks.map((task, index) => (
                <li key={index} className="text-gray-700">
                  {task.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-gray-300"></div>

          <div className="flex justify-end">
            <button
              type="submit"
              className=" bg-yellow-700 text-white py-2 px-4 hover:bg-indigo-700 rounded-3xl mt-5"
              disabled={loading}
            >
              {loading ? "Creating..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
