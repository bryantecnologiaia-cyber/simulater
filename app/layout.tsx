import type {Metadata} from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ESCSIMULADOS | Prova Paulista, SARESP, ENEM, OBMEP e OBA 100% Gratuito',
  description: 'Treine para Prova Paulista, SARESP, ENEM, OBMEP e OBA. 100% gratuito, sem login e sem cadastro, com simulados comentados DRIK.',
  openGraph: {
    title: 'ESCSIMULADOS - Treino Inteligente de Provas e Olimpíadas',
    description: 'Simulados de Ensino Fundamental e Médio 100% livres e gratuitos. Sem cadastro. Responda e confira o gabarito comentado instantâneo.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESCSIMULADOS - Treino Inteligente de Provas e Olimpíadas',
    description: 'Simulados para Prova Paulista, SARESP, ENEM, OBMEP e OBA 100% gratuitos.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-sans text-slate-800 bg-[#FAFAFA] min-h-screen selection:bg-pink-100 selection:text-pink-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
