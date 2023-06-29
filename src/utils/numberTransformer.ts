import { ValueTransformer } from 'typeorm';

export const numberTransformer: ValueTransformer = {
  from(data: string): number {
    return parseFloat(data);
  },
  to(data: number): number {
    return data;
  },
};
