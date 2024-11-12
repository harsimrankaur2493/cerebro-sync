import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import Chatbot from "./Chatbot"; // Import the Chatbot component
import { FaRobot } from "react-icons/fa"; // Icon for chatbot button

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State to toggle Chatbot visibility
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0">
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          ☰
        </button>

        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />

          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />
        <UserAvatar />

        {/* Chatbot Toggle Button */}
        <button
          onClick={() => setShowChatbot((prev) => !prev)}
          className="text-xl text-gray-500 hover:text-gray-700"
          title="Open Chatbot"
        >
          <FaRobot />
        </button>
      </div>

      {/* Chatbot Component */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-80 h-96">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default Navbar;
