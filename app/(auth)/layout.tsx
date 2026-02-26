import { Card } from '@/components/ui/card'

interface AuthLayoutProps {
    children: React.ReactNode
}

const layout = ({children}:AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Card className='w-[40vw]'>
            {children}
        </Card>
    </div>
  )
}

export default layout