import { Navigate, Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CodeEditor from "./pages/CodeEditor";
import CodeHistory from "./pages/CodeHistory";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useAuthCheck } from "./hooks/auth.hooks";
import {
  selectAuthIsAuthenticated,
  selectAuthLoading,
} from "./selectors/auth.selectors";

function App() {
  const isAuthenticated = useSelector(selectAuthIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useAuthCheck();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen uppercase font-bold text-blue-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Projects /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/editor/:projectId"
          element={
            isAuthenticated ? <CodeEditor /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/editor-history/:projectId"
          element={
            isAuthenticated ? <CodeHistory /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
