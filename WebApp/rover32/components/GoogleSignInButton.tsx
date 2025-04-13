import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => signIn("google");

  return (
    <Button onClick={loginWithGoogle} className="w-full flex items-center space-x-2">
      <FaGoogle size={20} color="#ffffff" />
      <span>{children}</span>
    </Button>
  );
};

export default GoogleSignInButton;