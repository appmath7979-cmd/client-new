import { navList } from "#/data/nav.data";
import { NavGroupMenu } from "./NavGroupMenu";
import { NavItem } from "./NavItem";
import { useMatches } from "@tanstack/react-router";

export function NavList() {
  const matches = useMatches();
  const isShowNavbar = !matches.some((s) => s.staticData?.isShowNavbar);

  const homeItem = navList.find((i) => i.id === "home-nav");
  const chatbotItem = navList.find((i) => i.id === "chatbot-nav");
  const reportItem = navList.find((i) => i.id === "report-nav");
  const profileItem = navList.find((i) => i.id === "profile-nav");

  const groupItems = navList.filter(
    (i) => i.id === "customer-nav" || i.id === "layoff-nav",
  );

  return (
    <>
      {isShowNavbar ? (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 h-16 flex items-center justify-around capitalize">
          {homeItem && <NavItem item={homeItem} />}
          {chatbotItem && <NavItem item={chatbotItem} />}

          <NavGroupMenu items={groupItems} />

          {reportItem && <NavItem item={reportItem} />}
          {profileItem && <NavItem item={profileItem} />}
        </nav>
      ) : null}
    </>
  );
}
