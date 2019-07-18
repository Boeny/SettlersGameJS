
export function random(min: number, max?: number): number {

    if (max === undefined || min > max) {
        return min * Math.random();
    }
    if (min === max) return min;

    if (min === 0 && max === 1) {
        return Math.random() < 0.5 ? 0 : 1;
    }
    return (max + 1 - min) * Math.random() + min; // +1 because max is never achieved
}

export function range(min: number, max?: number): number[] {

    if (max === undefined || min > max) {
        return Array.from({ length: min }).map((_, i) => i);
    }
    return Array.from({ length: max + 1 - min }).map((_, i) => i + min);
}

export function randomElem<T>(arr: T[]): T {
    return arr[random(0, arr.length - 1)];
}

export function tryRandomElem<T>(arr: T[]): T | null {
    return arr[random(0, arr.length - 1)] || null;
}

export function lastElement<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function tryLastElement<T>(arr: T[]): T | null {
    return arr[arr.length - 1] || null;
}
