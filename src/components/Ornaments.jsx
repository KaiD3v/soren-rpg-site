// Ornamentos reutilizados pelas páginas: divisor com glifo e título de página.

export function Divider({ glyph = "🜍", className = "" }) {
  return (
    <div className={`divisor ${className}`} aria-hidden="true">
      <span className="text-lg">{glyph}</span>
    </div>
  );
}

// No palco o título fica numa faixa compacta (glifos flanqueando o nome) para sobrar altura ao conteúdo.
export function PageTitle({ glyph, title, children }) {
  return (
    <header className="text-center mb-10 stage:mb-5 stage:flex-none">
      <h1 className="font-display text-5xl md:text-6xl stage:text-5xl leading-none flex items-center justify-center gap-5">
        <span className="text-2xl text-accent" aria-hidden="true">{glyph}</span>
        {title}
        <span className="text-2xl text-accent" aria-hidden="true">{glyph}</span>
      </h1>
      {children && <p className="text-dim italic mt-3 stage:mt-2 max-w-2xl mx-auto">{children}</p>}
      <Divider className="mt-6 max-w-md mx-auto stage:hidden" />
    </header>
  );
}
