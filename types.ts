export interface HexagramData {
    id: number;
    title: string;
    binary: string; // "111111" etc.
    dictamen: string;
    imagen: string;
    fullText: string;
}

export interface TrigramData {
    name: string;
    description: string;
    binary: string;
}

export enum HexagramLineType {
    YIN = 0,
    YANG = 1
}

export interface TrigramInfo {
    lines: number[]; // Array of 3 numbers
    data: TrigramData;
}