import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios'; // Para interactuar con la API de Strapi

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login-1', // Página personalizada de inicio de sesión
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'demo@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          console.log('Autorizando usuario con credenciales:', credentials);

          // Validar credenciales contra Strapi
          const response = await axios.post(`${process.env.STRAPI_URL}/auth/local`, {
            identifier: credentials.email, // Strapi usa "identifier" en lugar de "email"
            password: credentials.password,
          });

          console.log('Respuesta de Strapi:', response.data);

          const user = response.data.user;
          const jwt = response.data.jwt;

          if (user) {
            console.log('Usuario autenticado:', user);

            // Generar la URL completa del avatar si está presente
            const avatarUrl = user.avatar && user.avatar.length > 0
              ? `${process.env.STRAPI_URL}${user.avatar[0].url}`
              : ''; // Valor predeterminado si no hay avatar

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              jwt, // Guardar el JWT para futuras solicitudes si es necesario
              lastName: user.last_name || '', // Campo adicional
              avatar: avatarUrl, // URL completa del avatar
              createdAt: user.createdAt || '', // Campo adicional
            };
          }

          console.error('Usuario no encontrado en la respuesta.');
        } catch (error) {
          console.error(
            'Error autorizando con Strapi:',
            error.response?.data?.message || error.message
          );
          throw new Error('Correo o contraseña incorrectos.');
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('Generando sesión con token:', token);

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.jwt = token.jwt; // Adjuntar el JWT para solicitudes autenticadas
        session.user.lastName = token.lastName || ''; // Campo adicional
        session.user.avatar = token.avatar || ''; // Campo adicional (URL del avatar completo)
        session.user.createdAt = token.createdAt || ''; // Campo adicional
      }

      console.log('Sesión generada:', session);
      return session;
    },
    async jwt({ token, user }) {
      console.log('Generando token JWT. Usuario:', user, 'Token existente:', token);

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.jwt = user.jwt; // Guardar el JWT en el token JWT de NextAuth
        token.lastName = user.lastName || ''; // Campo adicional
        token.avatar = user.avatar || ''; // URL completa del avatar ya generada
        token.createdAt = user.createdAt || ''; // Campo adicional
      }

      console.log('Token JWT generado:', token);
      return token;
    },
  },
});

export { handler as GET, handler as POST };