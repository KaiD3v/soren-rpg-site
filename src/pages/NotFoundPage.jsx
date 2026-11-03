import { Link } from "react-router";

// Rota inexistente: uma folha arrancada do diário, com as bordas queimadas.
export default function NotFoundPage() {
  return (
    <div className="stage:h-full grid place-items-center py-10">
      <article className="folha-queimada text-center">
        <p className="font-sc text-sm text-[#6a5636]">Fólio sem número</p>
        <h1 className="font-gothic text-5xl text-[#3a0c08] mt-2">Página arrancada</h1>
        <p className="text-xl italic mt-6">Esta página foi queimada. Ou nunca existiu.</p>
        <p className="mt-4 text-[#4a3826]">
          Sobrou só a margem, chamuscada. Se havia algo escrito aqui, eu mesmo devo ter decidido que não valia a pena guardar.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 mt-8" aria-label="Voltar ao arquivo">
          <Link to="/diario" className="botao text-sm">Abrir o diário</Link>
          <Link to="/" className="botao text-sm">Voltar à Matriz</Link>
        </nav>
      </article>
    </div>
  );
}
