import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { authResult } from "../constants/types";
import { useNavigate } from "react-router-dom";

const TopRightNav: React.FC = () => {
    const navigate = useNavigate();
    const auth: authResult = useAuth();
    const [opacity, setOpacity] = useState(1);

    // Handle scroll to adjust opacity
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const newOpacity = Math.max(1 - scrollTop / 200, 0); // Adjust fade distance
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const commonStyles = {
        backgroundColor: `rgba(23, 23, 23, ${opacity})`, // Dark transparent background
        color: `rgba(255, 255, 255, ${opacity})`, // Bright text
    };

    if (auth.authStatus === "authenticated" && auth.user) {
        return (
            <div
                className="absolute top-0 left-0 w-full p-3 flex items-center justify-between transition-opacity duration-300 z-50"
                style={commonStyles}
            >
                {/* Logo */}
                <div
                    className="text-lg font-bold text-gradient cursor-pointer"
                    onClick={() => navigate("/home")}
                    style={{
                        backgroundImage: "linear-gradient(to right, #4f46e5, #ec4899)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Random Chess Game
                </div>

                {/* User Details */}
                <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="flex flex-col items-end">
                        <span className="font-semibold">{auth.user.username}{"   "+auth.user.Id }</span>
                        <span className="text-sm text-gray-400">{auth.user.email}</span>
                    </div>
                    <img
                        src="https://ia601009.us.archive.org/13/items/HeaderIconUser/Header-Icon-User.png"
                        alt="User Icon"
                        className="h-8 w-8 rounded-full border-2 border-indigo-500"
                    />
                </div>
            </div>
        );
    }

    if (auth.authStatus === "loading") {
        return (
            <div
                className="absolute top-0 left-0 w-full p-3 flex items-center justify-center transition-opacity duration-300 z-50"
                style={commonStyles}
            >
                <span className="text-gray-400">Loading...</span>
            </div>
        );
    }

    if (auth.authStatus === "unauthenticated") {
        return (
            <div
                className="absolute top-0 left-0 w-full p-3 flex items-center justify-between transition-opacity duration-300 z-50"
                style={commonStyles}
            >
                {/* Logo */}
                <div
                    className="text-lg font-bold text-gradient cursor-pointer"
                    onClick={() => navigate("/")}
                    style={{
                        backgroundImage: "linear-gradient(to right, #4f46e5, #ec4899)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Random Chess Game
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-4 rounded hover:scale-105 transition-transform"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded hover:scale-105 transition-transform"
                    >
                        Signup
                    </button>
                </div>
            </div>
        );
    }

    return null; // Default case
};

export default TopRightNav;
