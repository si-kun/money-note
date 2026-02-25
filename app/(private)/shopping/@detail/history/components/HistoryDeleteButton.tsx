"use client"

import { deleteHistory } from '@/app/server-aciton/shopping/history/deleteHistory'
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface HistoryDeleteButtonProps {
    historyId: string
}

const HistoryDeleteButton = ({historyId}:HistoryDeleteButtonProps) => {

    const router = useRouter()

    const handleDelete = async() => {
        try {
            const result = await deleteHistory(historyId);

            if(result.success) {

                toast.success(result.message);
                router.push("/shopping/history");
            } else {
                toast.error(result.message);
            }
        } catch(error) {
            console.error("履歴の削除に失敗:", error);
        }
    }

  return (
    <DeleteConfirmDialog onConfirm={handleDelete} />

  )
}

export default HistoryDeleteButton