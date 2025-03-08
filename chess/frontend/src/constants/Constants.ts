import { Chess, Color, PieceSymbol, Square } from "chess.js";

export const host =import.meta.env.BACKEND-_URL;
export const INIT ="init_game";
export const MOVE='move';
export const COLOR='color';
export const END ="end_game";
export const CHAT ="chat";
export const ABANDONED ="abandoned";
export interface move{
    from:string,
    to:string,

}
export type PlayerColor = 'b' | 'w';
export interface ChessBoardProps {
    ChessBoard: Chess;
    player_color: "w" | "b"|undefined;
    MessageMove: Function
    capturedWhite:string[]
    capturedBlack:string[]
    handleMove:Function
    
    board:
    ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    SetBoard: React.Dispatch<React.SetStateAction<
        ({
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null)[][]>>;
}
export type GAME_STATUS = 'in_progress' | 'completed' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';