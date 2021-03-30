export declare class ledService {
    async clearLEDs(): Promise<void>;
    async setAvailable(): Promise<void>;
    async setAway(): Promise<void>;
    async setBusy(): Promise<void>;
    async errorBlink(): Promise<void>;
}
