import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChessGame } from "../constants/types";
import TopRightNav from "../components/topRightNav";
import { host } from "../constants/Constants";

const Dashboard: React.FC = () => {
  const playerId=localStorage.getItem("playerId");
  const [games, setGames] = useState<ChessGame[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`http://${host}:5000/api/games`, {
          withCredentials: true
        });
        alert(response.data);

        if (response.status === 200) {
          setGames(response.data.games);
        }
      } catch (error: any) {
        setError("Failed to fetch games.");
        console.error(error);
      }
    };

    fetchGames();
  }, []);  // Empty dependency array to run the effect only once on component mount

  // Function to set the background color based on the game result with gradient, glow, and transparency
  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case "win":
        return "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-opacity-70 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg glow-win";
      case "loss":
        
        return "bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-opacity-70 hover:scale-105 hover:from-red-700 hover:via-red-800 hover:to-red-900 shadow-lg glow-loss";
      case "draw":
        return "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-opacity-70 hover:scale-105 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 shadow-lg glow-draw";
      default:
        return "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-opacity-70 hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg";
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 min-h-screen p-6 pl-0 justify-end">
      <div className="max-w-screen-lg mx-auto">
        <TopRightNav  />

        <div className="text-center text-white py-6">
          <h1 className="text-4xl font-semibold mb-6 mt-7">Game Dashboard</h1>

          {error && (
            <div className="bg-red-600 text-white p-4 pl-0 rounded-lg mb-6">
              {error}
            </div>
          )}

          {games.length === 0 ? (
            <div className="text-gray-400">No games available.</div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.game_id}
                  className={`p-6   ml-0 rounded-lg shadow-lg hover:scale-105 transition-all ${getResultColor(game.result)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-lg text-white">
                      Game ID: {game.game_id}
                    </div>
                    <div  className="text-sm text-gray-300">{(game.result==='draw')?'draw':(game.result==='player_exit')?'Player Exited':(game.winner_id==playerId)?
                    'win':'loss'}</div>
                    
                  </div>
                  <div className="text-white">
                    Players:{" "}
                    <span className="font-semibold text-blue-400">
                      {game.white_player_id}
                    </span>{" "}
                    vs{" "}
                    <span className="font-semibold text-red-400">
                      {game.black_player_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
