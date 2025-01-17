import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        const res = await fetch(`/api/user/todo/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setTodos(data);
      } catch (err) {
        setError("An error occurred while fetching your to-dos.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTodos();
  }, [currentUser._id]);

  const handleDeleteTodo = async (todoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo list?"
    );

    if (confirmDelete) {
      try {
        const res = await fetch(`/api/todo/todo/delete/${todoId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        alert("Todo deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <h1 className="text-3xl font-semibold text-center my-7">
          Goals for today
        </h1>

        <div className="mb-4">
          {loading ? (
            <p className="text-center text-blue-500">Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="border border-gray-300 rounded-lg p-3 flex justify-between items-center gap-4"
                  >
                    <Link
                      className="text-slate-900 font-semibold hover:underline truncate flex-1"
                      to={`/todo/${todo._id}`}
                    >
                      <p>{todo.title}</p>
                    </Link>
                    <div className="flex flex-col items-center">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteTodo(todo._id)}
                      >
                        Delete
                      </button>
                      <Link to={`/update-todo/${todo._id}`}>
                        <button className="text-blue-500 hover:underline">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No to-dos found.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/create-todo"
            className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-700 rounded-full"
          >
            Create New To-Do
          </Link>
        </div>
      </div>
    </main>
  );
}
