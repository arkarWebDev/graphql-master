import React from "react";
import { Link } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <nav className="flex items-center justify-between layout py-10">
      <Link to="/" className="text-4xl font-extrabold">
        Bagan Hotel
      </Link>
      <div className="space-x-4">
        <Button>Login</Button>
        <Button variant={"outline"}>Register</Button>
      </div>
    </nav>
  );
};

export default Header;
