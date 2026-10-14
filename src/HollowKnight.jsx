import HostedArcadeGame from './HostedArcadeGame';

export default function HollowKnight() {
  return <HostedArcadeGame opaqueOrigin title="Hollow Knight"
    url={`${import.meta.env.BASE_URL}ports/hollow-knight.json`}
    source="https://github.com/web-ports/hollow-knight"
    controls={{en: 'Keyboard / mouse · Large initial download', tr: 'Klavye / fare · İlk indirme büyük'}} />;
}
