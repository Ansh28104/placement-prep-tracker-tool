import { NavLink } from "react-router-dom"
import { Home, Building2, Code, Brain, FileText, MessageSquare, Target, BookOpen, Gift } from "lucide-react"

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Applications", href: "/applications", icon: Building2 },
    { name: "Coding Practice", href: "/coding", icon: Code },
    { name: "Aptitude Prep", href: "/aptitude", icon: Brain },
    { name: "Resume Manager", href: "/resume", icon: FileText },
    { name: "Interviews", href: "/interviews", icon: MessageSquare },
    { name: "Goals & Targets", href: "/goals", icon: Target },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Rewards", href: "/rewards", icon: Gift },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
