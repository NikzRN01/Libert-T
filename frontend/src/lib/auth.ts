"use client";

import { useSyncExternalStore } from "react";

export type StoredUser = {
    id?: string;
    name: string;
    email?: string;
    role?: string;
    createdAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parseStoredUser(raw: string): StoredUser | null {
    try {
        const parsed: unknown = JSON.parse(raw);
        if (!isRecord(parsed)) return null;
        if (typeof parsed.name !== "string") return null;

        return {
            id: typeof parsed.id === "string" ? parsed.id : undefined,
            name: parsed.name,
            email: typeof parsed.email === "string" ? parsed.email : undefined,
            role: typeof parsed.role === "string" ? parsed.role : undefined,
            createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : undefined,
        };
    } catch {
        return null;
    }
}

function subscribeStorage(callback: () => void) {
    if (typeof window === "undefined") return () => {};

    const handler = () => callback();
    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
}

function getLocalStorageItemSnapshot(key: string): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
}

export function useStoredUser(): StoredUser | null {
    const rawUser = useSyncExternalStore(
        subscribeStorage,
        () => getLocalStorageItemSnapshot("user"),
        () => null
    );

    return rawUser ? parseStoredUser(rawUser) : null;
}

export function useStoredToken(): string | null {
    return useSyncExternalStore(
        subscribeStorage,
        () => getLocalStorageItemSnapshot("token"),
        () => null
    );
}

export function clearAuthStorage() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
}
