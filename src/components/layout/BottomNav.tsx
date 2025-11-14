import { Home, MapPin, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const { t } = useLanguage();
  
  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: MapPin, label: t('nav.services'), path: "/services" },
    { icon: User, label: t('nav.profile'), path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-all hover:bg-muted/50"
            activeClassName="text-primary bg-primary/10"
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
