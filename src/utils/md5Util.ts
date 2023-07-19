import md5 from 'md5';

export const generateKey = (value: string) => md5(value);
