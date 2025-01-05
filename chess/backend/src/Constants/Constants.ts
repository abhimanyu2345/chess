export const INIT ="init_game";
export const CHAT ="chat";
export const MOVE='move';
export const END ="end_game";
export const ABANDONED ="abandoned";
export type move={
    from:string,
    to:string,

}
export type User ={
    Id:string,
    username:string,
    email:string

}|null;

