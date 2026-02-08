import { API_URL } from "../variables";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handleFetch(endpoint: string, method: Method, object: object = {}) {
    try {
        const res = await fetch(API_URL + endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            ...object
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        }

        return await res.json();
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function getFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "GET", object)
}

export async function postFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "POST", object)
}

export async function putFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "PUT", object)
}

export async function patchFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "PATCH", object)
}

export async function deleteFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "DELETE", object)
}
