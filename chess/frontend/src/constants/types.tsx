
export type User = {
    Id: string;
    username: string;
    email: string;
  } | null;
  
  export type authResult = {
    authStatus: "authenticated" | "unauthenticated" | "loading";
    user: User | null;
    error: string | null;
  };
  export interface ChessGame {
    game_id: number;
    white_player_id: number;
    black_player_id: number;
    result: string;
    start_time: string;
    end_time: string;
    winner_id: number | null;
  };