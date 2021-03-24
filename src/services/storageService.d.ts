import { AccessToken } from "./../models/accessToken";
export declare class storageService {
    init(): Promise<void>;
    setToken(token: AccessToken): Promise<void>;
    getToken(): Promise<AccessToken | null>;
    removeToken(): Promise<void>;
    setDeviceCodeDate(date: Date): Promise<void>;
    getDeviceCodeDate(): Promise<Date | null>;
    removeDeviceCodeDate(): Promise<void>;
    getFromStorage(identifier: string): Promise<string | null>;
    setToStorage(identifier: string, value: string): Promise<void>;
    removeFromStorage(identifier: string): Promise<void>;
}
