import { useRef } from "react";

function Register() {
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value || "";
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    console.log({ name, username, password });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="p-8 w-100 bg-white border rounded shadow-md border-gray-200">
        <h3 className="text-2xl mb-4 text-center uppercase font-bold text-blue-500">
          Register
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex-col content-evenly space-y-4">
            <input
              type="text"
              id="name"
              className="w-full py-2 px-3 border rounded shadow text-gray-700 border-gray-400"
              ref={nameRef}
              placeholder="Enter name"
              onChange={(e) => {
                if (nameRef.current) {
                  nameRef.current.value = e.target.value;
                }
              }}
            />
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
              Create New Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
