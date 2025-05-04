import { FC, ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const GoogleButton: FC<GoogleButtonProps> = ({ children, onClick }) => {
  const loginWithGoogle = async () => {
    if (onClick) await onClick();
    await signIn("google");
  };

  return (
    <Button 
      onClick={loginWithGoogle} 
      className="w-full flex items-center space-x-2"
      variant="outline"
    >
      <FaGoogle size={20} className="text-foreground" />
      <span>{children}</span>
    </Button>
  );
};

export default GoogleButton;