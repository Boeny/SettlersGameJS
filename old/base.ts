
export function random(min: number, max?: number): number {

    if (!max) {
        max = min;
        min = 0;
    }

    if (min === max) return min;

    if (min === 0 && max === 1) {
        return Math.random() < 0.5 ? 0 : 1;
    }
    return (1 + max - min) * Math.random() + min; // +1 because max is never achieved
}

export function range(min: number, max?: number): number[] {

    if (!max) {
        max = min;
        min = 0;
    }

    return Array.from({ length: max - min }).map((_, i) => i + min);
}

export function randomElem<T>(arr: T[]): T | null {
    return arr[random(0, arr.length - 1)] || null;
}
