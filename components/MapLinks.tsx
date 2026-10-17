type Place = { name: string; street: string; city: string; region: string; zip: string };

/** Apple Maps, Google Maps and Waze, each opened on the place by name and street address. */
export default function MapLinks({ place }: { place: Place }) {
  const address = `${place.street}, ${place.city}, ${place.region} ${place.zip}`;
  const q = encodeURIComponent(`${place.name}, ${address}`);
  const links = [
    { label: "Apple Maps", href: `https://maps.apple.com/?q=${encodeURIComponent(place.name)}&address=${encodeURIComponent(address)}` },
    { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${q}` },
    { label: "Waze", href: `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes` },
  ];
  return (
    <div className="maps" aria-label={`Directions to ${place.name}`}>
      {links.map((l) => (
        <a key={l.label} className="btn ghost" href={l.href} target="_blank" rel="noopener">
          {l.label}
        </a>
      ))}
    </div>
  );
}
