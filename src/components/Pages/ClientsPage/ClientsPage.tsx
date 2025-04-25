import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import ClientModal from '@/components/Composite/ClientModal/ClientModal'
import { ClientDTOPlaceholder } from '@/components/Generic/ClientCard/ClientCard'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'

interface ClientsPageProps {
  clients: ClientDTOPlaceholder[]
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients }) => {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <MagnifyingGlassIcon className="text-dark-blue w-4 h-4" />
        </span>
        <input 
          placeholder="Search client..."
          className="pl-11 w-full placeholder-muted-blue text-dark-blue border-[1.5px] border-deeper-blue focus:outline focus:outline-deeper-blue rounded-full px-4 pt-2 pb-1.5 text-sm font-normal bg-light-beige"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <XMarkIcon className="text-dark-blue hover:text-deeper-blue w-4 h-4 cursor-pointer" />
        </span>
      </div>
      <div className="pt-8">
        <ClientGroup clients={clients}/>
      </div>
    </div>
  )
}

export default ClientsPage