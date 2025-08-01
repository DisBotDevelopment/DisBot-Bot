export interface CreateOptions {
    backupName: string,
    backupID?: string;
    maxMessagesPerChannel?: number;
    jsonSave?: boolean;
    jsonBeautify?: boolean;
    doNotBackup?: string[];
    backupMembers?: boolean;
    saveImages?: string;
}
