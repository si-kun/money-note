import { Category } from '@/generated/prisma/client';
import { atom } from 'jotai';

export const categoriesAtom = atom<Category[]>([]);