"use client";

import { useSyncExternalStore } from "react";

export type StoredUser = {
    id?: string;
    name: string;
    email?: string;
    role?: string;
    createdAt?: string;
    avatar?: string;
};

const AUTH_EVENT = "skillxintell-auth";

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
            avatar: typeof parsed.avatar === "string" ? parsed.avatar : undefined,
        };
    } catch {
        return null;
    }
}

function subscribeStorage(callback: () => void) {
    if (typeof window === "undefined") return () => {};

    const handler = () => callback();
    window.addEventListener("storage", handler);
    window.addEventListener(AUTH_EVENT, handler as EventListener);

    return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(AUTH_EVENT, handler as EventListener);
    };
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
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuthToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (!token) window.localStorage.removeItem("token");
    else window.localStorage.setItem("token", token);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuthUser(user: StoredUser | null) {
    if (typeof window === "undefined") return;
    if (!user) window.localStorage.removeItem("user");
    else window.localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuthSession(session: { token: string; user: StoredUser }) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("token", session.token);
    window.localStorage.setItem("user", JSON.stringify(session.user));
    window.dispatchEvent(new Event(AUTH_EVENT));
}
