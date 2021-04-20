import storage from 'node-persist';

let isInitiated = false;
const deviceCodeDateStorageIdentifier = "deviceCodeDate";

export class storageService {
    async init() : Promise<void> {
        await storage.init()
    };

    async clear(): Promise<void> {
        if(!isInitiated){
            await this.init();
            isInitiated = true;
        }

        await storage.clear();
    };

    async setDeviceCodeDate(): Promise<void> {
        const date = new Date();
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