import { Dispensary } from '../types'
import DispensaryCard from './DispensaryCard'

interface DispensaryListProps {
  dispensaries: Dispensary[]
  setSelectedDispensary: (dispensary: Dispensary) => void
}

export default function DispensaryList({ dispensaries, setSelectedDispensary }: DispensaryListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Nearby Dispensaries</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dispensaries.map(dispensary => (
          <DispensaryCard 
            key={dispensary.id} 
            dispensary={dispensary} 
            onSelect={setSelectedDispensary} 
          />
        ))}
      </div>
    </div>
  )
}
