export function seededRandom(seed) {
    return function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}
export function createSeededRandom(seed) {
    function random() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }

    function range(min, max) {
        return min + random() * (max - min);
    }
    function rangeInt(min, max) {
        return Math.floor(min + random() * (max - min));
    }

    return { random, range, rangeInt };
}


export function generateRandomAddress() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = 'tz1';
    for (let i = 0; i < 33; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}
export function stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32-bit integer
    }
    return Math.abs(hash); // Return positive value to use as a seed
}
export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function map(value, min1, max1, min2, max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
export function map0(value, min, max) {
    return min + value * (max - min);
}
function r2(probability, first, second) {
    if (fxrand() < probability) {
        return first;
    }
    else {
        return second;
    }
}

export function lerp(A, B, t) {
    return A + (B - A) * t;
}

export function overlaps(a, b) {
    // no horizontal overlap
    if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;
    // no vertical overlap
    if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;
    return true;
}

export function contains(rectangle, x, y) {
    return rectangle.x1 <= x && x <= rectangle.x2 &&
        rectangle.y1 <= y && y <= rectangle.y2;
}

