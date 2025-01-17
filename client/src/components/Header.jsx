import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-yellow-50 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl max-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap gap-2">
            <span className="text-slate-900">Code</span>
            <span className="text-slate-900">Test</span>
          </h1>
        </Link>
        <div className="flex">
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <nav className="text-slate-900 hover:underline font-semibold">
                Sign In
              </nav>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
