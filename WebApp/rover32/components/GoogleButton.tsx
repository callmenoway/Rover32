import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
  children: ReactNode;
  onClick?: () => void; // Add optional onClick prop
}

const GoogleButton: FC<GoogleButtonProps> = ({ children, onClick }) => {
  const loginWithGoogle = async () => {
    if (onClick) await onClick(); // Call onClick if provided
    await signIn("google");
  };

  return (
    <Button onClick={loginWithGoogle} className="w-full flex items-center space-x-2">
      <FaGoogle size={20} color="#ffffff" />
      <span>{children}</span>
    </Button>
  );
};

export default GoogleButton;