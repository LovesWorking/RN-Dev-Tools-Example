// Lightweight React type shims to reduce per-file imports
// Prefer importing specific types in new code.

declare type ReactNode = import("react").ReactNode;
declare type FC<P = {}> = import("react").FC<P>;
declare type ComponentType<P = any> = import("react").ComponentType<P>;
declare type MutableRefObject<T> = import("react").MutableRefObject<T>;

