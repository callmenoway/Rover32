import { router, procedure } from '../trpc';
import { z } from 'zod';

export const authRouter = router({
  login: procedure
    .input(
      z.object({
        username: z.string().min(3, "Il nome utente deve avere almeno 3 caratteri"),
        password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
      })
    )
    .mutation(async ({ input }) => {
      const { username, password } = input;

      // Logica di autenticazione (simulata)
      if (username === 'user' && password === 'password123') {
        return { success: true, message: 'Login effettuato con successo' };
      } else {
        return { success: false, message: 'Nome utente o password errati' };
      }
    }),
});
