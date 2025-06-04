export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    role: 'admin' | 'developer' | 'user';
    classification: 1 | 2 | 3 | 4 | 5;
  };
