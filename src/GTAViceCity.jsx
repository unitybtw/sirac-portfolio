import HostedArcadeGame from './HostedArcadeGame';

export default function GTAViceCity() {
  return <HostedArcadeGame opaqueOrigin title="GTA Vice City"
    url={`${import.meta.env.BASE_URL}ports/vice-city.json`}
    source="https://github.com/web-ports/vice-city"
    controls={{en: 'Keyboard / mouse · Large initial download', tr: 'Klavye / fare · İlk indirme büyük'}} />;
}
