import { useState } from "react";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("!!");
  };

  return (
    <nav className="p-4 text-white shadow-md bg-blue-500 ">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">CoDev2gether</div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="py-2 px-4 rounded hover:bg-blue-400 cursor-pointer"
          >
            John
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-32 z-10 right-0 bg-white rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
