import { FC, ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GithubButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const GithubButton: FC<GithubButtonProps> = ({ children, onClick }) => {
  const loginWithGithub = async () => {
    if (onClick) await onClick();
    await signIn("github");
  };

  return (
    <Button 
      onClick={loginWithGithub}
      className="w-full flex items-center space-x-2"
      variant="outline"
      >
      <FaGithub size={20} className="text-foreground" />
      <span>{children}</span>
    </Button>
  );
};

export default GithubButton;