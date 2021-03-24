export declare class mailService {
    sendEmail(to: string, subject: string, text: string): void;
    sendLoginEmail(expiresOn: string, message: string): void;
}
