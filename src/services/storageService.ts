import { AccessToken } from "../models/accessToken";
const { APP_ID } = require('./../helper/config');

import storage from 'node-persist';

let isInitiated = false;
const deviceCodeDateStorageIdentifier = "deviceCodeDate";

export class storageService {
    async init() : Promise<void> {
        await storage.init()
    };

    async setToken(token: AccessToken): Promise<void> {
        await this.setToStorage(`${APP_ID}-token`, JSON.stringify(token));
    };

    async getToken(): Promise<AccessToken | null> {
        const token = await this.getFromStorage(`${APP_ID}-token`);
        if (token) {
            return JSON.parse(token);
        } else {
            return null;
        }
    };

    async removeToken(): Promise<void> {
        await this.removeFromStorage(`${APP_ID}-token`);
    };

    async setDeviceCodeDate(date: Date): Promise<void> {
        await this.setToStorage(deviceCodeDateStorageIdentifier, JSON.stringify(date));
    };

    async getDeviceCodeDate(): Promise<Date | null> {
        const date = await this.getFromStorage(deviceCodeDateStorageIdentifier);
        if (date) {
            return new Date(date);
        } else {
            return null;
        }
    };

    async removeDeviceCodeDate(): Promise<void> {
        await this.removeFromStorage(deviceCodeDateStorageIdentifier);
    };

    async getFromStorage(identifier: string): Promise<string | null> {
        if(!isInitiated){
            await this.init();
            isInitiated = true;
        }

        const data = await storage.get(identifier);
        if (data) {
            return data;
        } else {
            return null;
        }
    };

    async setToStorage(identifier: string, value: string): Promise<void> {
        if(!isInitiated){
            await this.init();
            isInitiated = true;
        }

        await storage.set(identifier, value);
    };

    async removeFromStorage(identifier: string): Promise<void> {
        if(!isInitiated){
            await this.init();
            isInitiated = true;
        }

        await storage.del(identifier);
    }
}