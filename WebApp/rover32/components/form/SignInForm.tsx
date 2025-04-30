'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GoogleButton from '../GoogleButton';
import GithubButton from '../GithubButton';
import DiscordButton from '../DiscordButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useState } from 'react';

//? Schema di validazione per il form di login
const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have at least 8 characters'),
});

//? Componente principale del form di login
export function SignInForm() {
  const router = useRouter();
  const [isThirdPartyLogin, setIsThirdPartyLogin] = useState(false);

  //? Configurazione del form con react-hook-form e validazione zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    //? Evita l'invio se è in corso un login con provider
    if (isThirdPartyLogin) return;
    
    try {
      const signInData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInData?.error) {
        toast.error(signInData.error);
        setValue('password', '');
      } else {
        //? Login riuscito, reindirizza alla dashboard
        toast.success('Login successful! Redirecting...');
        router.push('/vehicles');
      }
    } catch (error) {
      //! Gestione degli errori inaspettati
      console.error("Unexpected error:", error);
      toast.error('Unexpected error, try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      <video
        id="background-video"
        loop
        autoPlay
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/muci.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <nav className="w-full fixed top-0 left-0 z-20 shadow-md" style={{backgroundColor: 'transparent'}}>
            <div className="container mx-auto flex justify-between items-center px-4 py-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </nav>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register('email')} disabled={isThirdPartyLogin} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register('password')}
                disabled={isThirdPartyLogin}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button className="w-full mt-2" type="submit" disabled={isThirdPartyLogin}>
              Sign in
            </Button>

            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>

            <GoogleButton>Sign in with Google</GoogleButton>
            <GithubButton>Sign in with GitHub</GithubButton>
            <DiscordButton>Sign in with Discord</DiscordButton>

            <p className="text-center text-sm text-gray-600 mt-2">
              Don&apos;t have an account?&nbsp;
              <Link className="text-blue-500 hover:underline" href="/sign-up">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

//TODO Implementare reCAPTCHA per prevenire attacchi di forza bruta