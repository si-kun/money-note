import { List } from 'lucide-react';
import TransactionForm from '../form/TransactionForm';
import { Category } from '@/generated/prisma/client';

interface BreakdownHeaderProps {
  date: string;
  categories: Category[];
}

const BreakdownHeader = ({date,categories}: BreakdownHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 py-1">
        <List />
        <span className="font-semibold">内訳</span>
      </div>
      <TransactionForm date={date} categories={categories} />
    </div>
  );
};

export default BreakdownHeader