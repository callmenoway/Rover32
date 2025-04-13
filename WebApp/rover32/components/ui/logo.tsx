import Image from "next/image"
import Link from "next/link"
import logo from "@/public/rover32logo.png"

import dynamic from "next/dynamic";

const Logo = dynamic(() => Promise.resolve(() => {
  return (
    <div className="flex items-center space-x-2">
        <div onClick={() => window.location.href = "/"}>
            <Image
                src={logo}
                alt="Rover32 Logo"
                width={32}
                height={32}
            />
        </div>
    </div>
  );
}), { ssr: false });

export { Logo };
