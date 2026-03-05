import { API_URL } from "../variables";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type FetchReturn = object[] | object | null;

async function handleFetch(endpoint: string, method: Method, body: object = {}, object: object = {}): Promise<FetchReturn> {
    try {
        const res = await fetch(API_URL + endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            ...object
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        }

        return await res.json() as object;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function getFetch(endpoint: string, params: Record<string, string> = {}, object: object = {}): Promise<FetchReturn> {
    const stringParams = params ? "?" + new URLSearchParams(params).toString() : "";
    return await handleFetch(endpoint + stringParams, "GET", {}, object)
}

export async function postFetch(endpoint: string, body: object = {}, object: object = {}): Promise<FetchReturn> {
    return await handleFetch(endpoint, "POST", body, object)
}

export async function putFetch(endpoint: string, body: object = {}, object: object = {}): Promise<FetchReturn> {
    return await handleFetch(endpoint, "PUT", body, object)
}

export async function patchFetch(endpoint: string, body: object = {}, object: object = {}): Promise<FetchReturn> {
    return await handleFetch(endpoint, "PATCH", body, object)
}

export async function deleteFetch(endpoint: string, body: object = {}, object: object = {}): Promise<FetchReturn> {
    return await handleFetch(endpoint, "DELETE", body, object)
}
