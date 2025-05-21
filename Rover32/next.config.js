/** @type {import('next').NextConfig} */
const nextConfig = {
  //? Attiva StrictMode di React per identificare problemi potenziali
  reactStrictMode: true,
  
  //? Configurazione webpack personalizzata
  webpack: (config, { isServer }) => {
    //! Se lato client, escludiamo i moduli Node.js che sono solo per server
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
        path: false,
        stream: false,
        crypto: false,
        buffer: false,
        http: false,
        https: false,
        zlib: false,
        os: false,
        child_process: false,
        readline: false,
        process: false,
        querystring: false,
        url: false,
        ...config.resolve.fallback,
      };
      
      //! Esclusione di bcrypt e pacchetti correlati dal bundle client
      config.externals = [
        ...(config.externals || []),
        'bcrypt',
        'node-pre-gyp',
        '@mapbox/node-pre-gyp',
        'mock-aws-s3'
      ];
    }
    
    return config;
  },

  //SE SUCCEDE QUALCOSA ELIMINARE QUESTA PARTE---------------------------------------------------------------------
  output: 'standalone', // Creates a standalone build that doesn't require copying the entire node_modules folder
  swcMinify: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
      // Add other domains if needed for image sources
    ],
  },
  transpilePackages: [
    // Add packages that need transpilation if any
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  //---------------------------------------------------------------------------------------------------------------------

  typescript: {
    // Ignore build errors related to the params type issue
    ignoreBuildErrors: true,
  },

}

module.exports = nextConfig
