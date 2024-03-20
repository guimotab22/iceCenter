"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ICompany } from "@/interface/ICompany"
import { IStore } from "@/interface/IStore"
import { useState } from "react"
import GoogleMaps from "./GoogleMaps"
import Link from "next/link"
import { toast } from "sonner"
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";

interface StoreInformationsProps {
  company: ICompany
  store: IStore
}

const StoreInformations = ({ company, store }: StoreInformationsProps) => {

  const address = `${store.address.street}, ${store.address.number} - ${store.address.neighborhood}, ${store.address.city} - ${store.address.uf}, Brasil`
  const [openMap, setOpenMap] = useState(false)
  const [position, setPosition] = useState({ lat: 0, lng: 0 })

  async function handleMap() {
    const geocoder = new google.maps.Geocoder()
    const result = (await geocoder.geocode({ address })).results[0]
    setPosition({
      lat: result.geometry?.location?.lat(),
      lng: result.geometry?.location?.lng()
    })

    setOpenMap(!openMap)
  }
  async function handleCopy() {
    toast("Endereço Copiado!", {
      description: "Endereço salvo na sua área de transferência.",
      action: {
        label: "Entendi",
        onClick: () => ""
      }
    })
    await navigator.clipboard.writeText(address)
  }

  const importantInformations = [
    {
      label: "Nome da Empresa",
      value: company.name
    }, {
      label: "Nome da Loja",
      value: store.name
    }, {
      label: "Id da Loja",
      value: store.id
    },
  ]
  const inputsForm = [
    {
      label: "CEP",
      value: store.address.cep
    }, {
      label: "UF",
      value: store.address.uf
    }, {
      label: "Cidade",
      value: store.address.city
    }, {
      label: "Rua",
      value: store.address.street
    }, {
      label: "Bairro",
      value: store.address.neighborhood
    }, {
      label: "Número",
      value: store.address.number
    },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Informações</h2>

          <div className="grid grid-cols-3 gap-x-7 gap-y-3">
            {importantInformations.map(info =>
              <div key={info.label} className="flex flex-col gap-1">
                <Label>{info.label}</Label>
                <Badge variant={"outline"} className="self-start text-sm">{info.value}</Badge>
              </div>
            )}

          </div>
        </div>

        <div className="space-y-3">

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Localização</h2>
            <Button size={"sm"} onClick={handleCopy} className="self-start space-x-2">
              <MdContentCopy className="text-lg" />
              <p>Copiar endereço</p>
            </Button>

            <Button size={"sm"} onClick={handleMap} className="self-start space-x-2">
              <FaMapLocationDot className="text-lg" />
              <p>{openMap ? "Fechar mapa" : "Abrir mapa"}</p>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-x-7 gap-y-4">
            {inputsForm.map(input =>
              <div key={input.label} className="flex flex-col gap-1">
                <Label>{input.label}</Label>
                <Badge variant={"outline"} className="self-start text-sm">{input.value}</Badge>
              </div>
            )}
          </div>

        </div>
      </div>
      {openMap ?
        <>
          <div className="w-full h-[30rem] border-2">
            <GoogleMaps startingPosition={position} address={store.address} />
          </div>
          <Link href={`https://www.google.com.br/maps/@${position.lat},${position.lng},20z?`} target="_blank">
            <Button className="space-x-2">
              <FaMapMarkerAlt />
              <p>Abrir endereço no maps</p>
            </Button>
          </Link>
        </>
        : ""
      }

    </div>
  )
}

export default StoreInformations