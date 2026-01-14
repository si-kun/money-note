import { Category } from '@prisma/client';
import { atom } from 'jotai';

export const categoriesAtom = atom<Category[]>([]);