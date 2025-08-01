import {BackupData} from "./BackupData.js";

export interface BackupInfos {
    id: string;
    size: number;
    data: BackupData;
}
