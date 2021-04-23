import type { ArrowKeys, Direction, Orientation } from "@microsoft/fast-web-utilities";

/**
 * Enum for previous/next increments.
 *
 * @internal
 */
export enum Increment {
    previous = -1,
    next = 1,
}

/**
 * Map increments to Directionality as an object.
 *
 * @internal
 */
export type DirectionalIncrement = { [key in Direction]: Increment };

/**
 * A map for directionality derived from keyboard input strings,
 * visual orientation, and text direction.
 *
 * @internal
 */
export const OrientationKeyMapping: {
    [key in ArrowKeys]?: {
        [value in Orientation]?: DirectionalIncrement | Increment;
    };
} = {
    ArrowUp: {
        vertical: Increment.previous,
    },
    ArrowDown: {
        vertical: Increment.next,
    },
    ArrowLeft: {
        horizontal: {
            ltr: Increment.previous,
            rtl: Increment.next,
        },
    },
    ArrowRight: {
        horizontal: {
            rtl: Increment.previous,
            ltr: Increment.next,
        },
    },
};
