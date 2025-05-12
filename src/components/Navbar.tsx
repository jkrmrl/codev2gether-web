import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../actions/auth.actions";
import { RootState } from "../reducers/index";
import { AppDispatch } from "../store";

function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <nav className="p-4 text-white shadow-md bg-blue-500 ">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">CoDev2gether</div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="py-2 px-4 font-semibold text-blue bg-white-500 rounded cursor-pointer hover:bg-blue-400"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 px-4 font-semibold text-blue bg-white-500 rounded cursor-pointer hover:bg-blue-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="py-2 px-4 font-semibold text-blue bg-white-500 rounded cursor-pointer hover:bg-blue-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
