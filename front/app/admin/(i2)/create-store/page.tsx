"use client"
import { Card } from "@/components/ui/card"
import { StoreController } from "@/controller/StoreController"
import { IStore } from "@/interface/IStore"
import useCurrentCompany from "@/state/hooks/useCurrentCompany"
import { useEffect, useState } from "react"
import FormCreateStore from "./components/FormCreateStore"
import { Toaster } from "@/components/ui/toaster"

const CreateStores = () => {
  const company = useCurrentCompany()
  const [stores, setStores] = useState<IStore[]>()

  useEffect(() => {
    async function load() {
      if (company.storeId) {
        const resp = await StoreController.findAllByCompanyId(company.id)
        if (resp) {
          setStores(resp)
        }
      }
    }
    if (company) {
      load()
    }
  }, [company])


  return (
    <main className="flex flex-col items-center w-full px-4 sm:px-8">
      <Toaster />
      {company ?
        <div className="w-full flex flex-col items-center my-10 max-w-[70rem]">
          <div className="flex flex-col w-full gap-5">
            <h1 className="text-2xl font-semibold">Criar Loja</h1>
            <Card className="flex flex-col items-center p-6">
              <FormCreateStore company={company} />
            </Card>
          </div>
        </div>
        : ""}
    </main>
  )
}

export default CreateStores