import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./content/Home";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/user/Profile";
import CreateTodoList from "./pages/user/CreateTodoList";
import UpdateTodoList from "./pages/user/UpdateTodoList";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-todo" element={<CreateTodoList />} />
          <Route path="/update-todo/:todoId" element={<UpdateTodoList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
