import { FC, ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface DiscordButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const DiscordButton: FC<DiscordButtonProps> = ({ children, onClick }) => {
  const loginWithDiscord = async () => {
    if (onClick) await onClick();
    await signIn("discord");
  };

  return (
    <Button
      onClick={loginWithDiscord}
      className="w-full flex items-center space-x-2"
      variant="outline"
    >
      <FaDiscord size={20} className="text-foreground" />
      <span>{children}</span>
    </Button>
  );
};

export default DiscordButton;