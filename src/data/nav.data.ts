import { BotIcon, ChartNoAxesCombinedIcon, HomeIcon, User2Icon, Users2Icon } from "lucide-react"

interface INavItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

const navList: INavItem[] = [
  {
    id: "home-nav",
    label: "trang chủ",
    icon: HomeIcon,
    href: "/trang-chu"
  },
  {
    id: "chatbot-nav",
    label: "ChatBot",
    icon: BotIcon,
    href: "/chatbot"
  },
  {
    id: "customer-nav",
    label: "khách hàng",
    icon: Users2Icon,
    href: "/khach-hang"
  },
  {
    id: "layoff-nav",
    label: "cân hàng",
    icon: BotIcon,
    href: "/can-hang"
  },
  {
    id: "report-nav",
    label: "báo cáo",
    icon: ChartNoAxesCombinedIcon,
    href: "/bao-cao"
  },
  {
    id: "profile-nav",
    label: "Cá nhân",
    icon: User2Icon,
    href: "/ca-nhan"
  },
]

export { navList, type INavItem }