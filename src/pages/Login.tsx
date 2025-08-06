import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../actions/auth.actions";
import { AppDispatch } from "../store";
import * as selectors from "../selectors";

function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectors.selectAuthIsAuthenticated);
  const message = useSelector(selectors.selectAuthMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    dispatch(loginAction(username, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="p-8 w-100 bg-white border rounded shadow-md border-gray-200">
        <h3 className="text-2xl mb-4 text-center uppercase font-bold text-blue-500">
          Login
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex-col h-48 content-evenly space-y-4">
            <input
              type="text"
              id="username"
              className="w-full py-2 px-3 border rounded shadow text-gray-700 border-gray-400"
              ref={usernameRef}
              placeholder="Enter username"
              onChange={(e) => {
                if (usernameRef.current) {
                  usernameRef.current.value = e.target.value;
                }
              }}
            />
            <input
              type="password"
              id="password"
              className="w-full py-2 px-3 border rounded shadow text-gray-700 border-gray-400"
              ref={passwordRef}
              placeholder="Enter password"
              onChange={(e) => {
                if (passwordRef.current) {
                  passwordRef.current.value = e.target.value;
                }
              }}
            />
            <button
              type="submit"
              className="w-full py-2 px-3 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 cursor-pointer"
            >
              Sign In
            </button>
            {message && (
              <p className="mt-2 text-center text-sm text-red-500 ">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
