import { Chess, Color, PieceSymbol, Square } from "chess.js";
import useSocket from "../hooks/CustomHooks";
import { useEffect, useState } from "react";
import { ABANDONED, CHAT, COLOR, INIT, MOVE } from "../constants/Constants";
import ChessBoard from "../components/board";
import TopRightNav from "../components/topRightNav";
import Chat from "../components/chat";  // Ensure the Chat component is correctly imported

export default function Game() {
    const socket = useSocket();
    const [game, setGame] = useState<Chess>(new Chess());
    const [requestStatus, setRequestStatus] = useState(false);
    const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
    const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
    const [connection, setConnection] = useState(false);
    const [playerColor, setPlayerColor] = useState<'w' | 'b'>();
    const [board, setBoard] = useState<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>(game.board());

    const captureSound = new Audio('./capture.mp3');
    const moveSound = new Audio('./move-self.mp3');
    const playerId = localStorage.getItem('playerId');
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState<string[]>([]);

    const handleMove = (moveResult: any) => {
        if (moveResult.captured) {
            captureSound.play();
            const capturedPieceColor = game.turn() === 'w' ? 'b' : 'w';
            if (capturedPieceColor === 'w') {
                setCapturedWhite((prev) => [...prev, moveResult.captured]);
            } else {
                setCapturedBlack((prev) => [...prev, moveResult.captured]);
            }
        } else {
            moveSound.play();
        }
    };

    const handleSocketMessage = (data: MessageEvent) => {
        let message;
        try {
            message = JSON.parse(data.data);
        } catch (e) {
            console.error("Error parsing message", e);
            return;
        }

        switch (message.type) {
            case COLOR:
                if (message.message === "w" || message.message === "b") {
                    setConnection(true);
                    setPlayerColor(message.message);
                    alert(`You are playing as ${message.message}`);
                }
                break;

            case MOVE:
                const moveResult = game.move(message.move);
                setBoard(game.board());
                handleMove(moveResult);
                break;

            case ABANDONED:
                alert('Other player left the game.');
                setConnection(false);
                setRequestStatus(false);
                break;
            case 'chat':

                console.log(message.ChatContent);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    `${message.playerId} : ${message.ChatContent}`,
                ]);
                
                
                break;

            default:
                console.warn("Unknown message type", message);
                
        }
    };

    useEffect(() => {
        if (socket) {
            socket.onmessage = handleSocketMessage;
        }
    }, [socket]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        const handleUnload = () => {
            try {
                socket?.close(1000, 'player_exit');
            } catch (e) {
                console.error(e);
            }
        };

        if (connection) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('unload', handleUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, [connection, socket]);

    const sendMoveMessage = (move: any) => {
        if (!socket) {
            console.error("Socket connection is not available.");
            return;
        }

        try {
            const message = JSON.stringify({
                type: MOVE,
                playerId,
                move,
            });
            socket.send(message);
        } catch (error) {
            console.error("Error sending move message", error);
        }
    };

    if (!socket) {
        return <>Connecting...</>;
    }

    if (connection) {
        return (
            <div className="game-container flex ">
                <div className="chess-board-container min-w-fit pb-3 flex-1">
                    <ChessBoard
                        ChessBoard={game}
                        player_color={playerColor}
                        board={board}
                        SetBoard={setBoard}
                        MessageMove={sendMoveMessage}
                        capturedWhite={capturedWhite}
                        capturedBlack={capturedBlack}
                        handleMove={handleMove}
                    />
                </div>
                <div className="chat-container   ml-1 flex-1">
                    <Chat 
                    socket={socket}
                    messages={messages}
                    setMessages={setMessages} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3 border-spacing-0  text-red-500 bg-black min-h-screen flex justify-center items-center">
            <TopRightNav />
            <div className="text-center">
                {requestStatus ? (
                    <div className="text-white">Waiting for opponent...</div>
                ) : (
                    <button
                        onClick={() => {
                            socket?.send(
                                JSON.stringify({
                                    type: INIT,
                                    playerId,
                                    token,

                                })
                            );
                            setRequestStatus(true);
                        }}
                        disabled={requestStatus}
                        className={`${
                            requestStatus
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-700"
                        } text-white py-2 px-4 rounded-md`}
                    >
                        Start Game
                    </button>
                )}
            </div>
        </div>
    );
}
