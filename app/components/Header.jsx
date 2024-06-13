"use client";

import * as React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import NavigationBar from "./navbar";

function HeaderBar() {
  const [mounted, setMounted] = React.useState(false);
  const [url, seturl] = React.useState();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true); // Indicate that the component has mounted on the client side
    const path = `${pathname}`;
    seturl(path);
  }, [pathname]);

  const showLogin = mounted && url === "/";

  return <>{!showLogin ? <NavigationBar /> : ""}</>;
}

export default HeaderBar;
