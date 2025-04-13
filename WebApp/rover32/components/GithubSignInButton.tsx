import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GithubSignInButtonProps {
  children: ReactNode;
}

const GithubSignInButton: FC<GithubSignInButtonProps> = ({ children }) => {
  const loginWithGithub = () => signIn("github");

  return (
    <Button onClick={loginWithGithub} className="w-full flex items-center space-x-2">
      <FaGithub size={20} color="#ffffff" />
      <span>{children}</span>
    </Button>
  );
};

export default GithubSignInButton;