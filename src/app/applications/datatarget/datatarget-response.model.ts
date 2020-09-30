import { Application } from '@applications/application.model';
import { DataTargetType } from '@shared/enums/datatarget-type';

export class DatatargetResponse {
    application: Application;
    id: number;
    name: string;
    timeout: number;
    type: DataTargetType;
    url: string;
    authorizationHeader: string;
}
