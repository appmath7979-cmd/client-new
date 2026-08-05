type Region = "MB" | "MT" | "MN"

interface IRegionItem {
  id: string
  label: string
  value: Region
}

export type { Region, IRegionItem }