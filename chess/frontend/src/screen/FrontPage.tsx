import React from 'react';
import './../index.css';
import JoinButton from '../components/joinbutton';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import TopRightNav from '../components/topRightNav';

const FrontPage: React.FC = () => {
    
    const user = useAuth();
    localStorage.setItem('playerId',user.user?.Id ||'null');

    return (
        <div className="bg-gray-900 min-h-screen p-6 flex items-center justify-center">
            <TopRightNav />
            <div className=" mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 rounded-lg shadow-xl px-5 pt-10 h-[90vh] w-full max-w-screen-lg">
                <img
                    src="/chessboard.jpg"
                    alt="Chessboard for Random Chess Game"
                    className="w-full h-auto object-cover rounded-lg shadow-lg col-span-1 order-2 sm:order-1"
                />
                <div className="col-span-1 order-1 sm:order-2 flex flex-col items-center justify-center py-9">
                    <h1 className="text-white text-4xl font-bold mb-6 text-center">
                        Play a Random Chess Game
                    </h1>
                    <JoinButton />
                    <button
                        aria-label="Play with Computer"
                        className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-2xl mt-6 hover:scale-105 transition-transform"
                    >
                        Play With Computer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrontPage;
