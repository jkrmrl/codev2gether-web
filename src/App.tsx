import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers/index";
import { refreshTokenAction } from "./actions/auth.actions";
import { AppDispatch } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const location = useLocation();

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      if (
        !isAuthenticated &&
        !loading &&
        location.pathname !== "/login" &&
        location.pathname !== "/register"
      ) {
        dispatch(refreshTokenAction());
      }
    };

    checkAuthOnLoad();
  }, [dispatch, isAuthenticated, loading, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/projects" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/projects" /> : <Register />}
        />
        <Route
          path="/projects"
          element={isAuthenticated ? <Projects /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
