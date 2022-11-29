export class User {
    constructor(
        public integrations: Partial<Record<IntegrationType, Integration>> = {}
    ) { }
}

export interface Integration {
    readonly type: IntegrationType;
}

export type IntegrationType = 'jira';

export class JiraIntegration implements Integration {
    type: IntegrationType = 'jira';
    
    constructor(
        public email: string = '',
        public apiKey: string = '',
        public projectKey: string = '', 
        public host: string = '',
    ) {}
}