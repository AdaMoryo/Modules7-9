export interface Rule {
    id: string;
    role: 'admin' | 'developer' | 'user';
    action : string;
    clasifiction : 1 | 2 | 3 | 4 | 5
};
