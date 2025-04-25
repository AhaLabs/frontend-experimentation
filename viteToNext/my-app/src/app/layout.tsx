export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <head>
          <title>Mon app migrée</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }
  