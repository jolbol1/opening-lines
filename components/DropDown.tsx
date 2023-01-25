interface DropDownProps {
  vibes: string[]
  vibe: string
  setVibe: (vibe: string) => void
}

export function DropDown({ vibes, vibe, setVibe }: DropDownProps) {
  const vibeCheck = (element: string) => element === vibe

  return (
    <select
      className="select select-bordered w-full"
      onChange={(e) => setVibe(vibes[Number.parseInt(e.target.value, 10)])}
      value={vibes.findIndex((element) => vibeCheck(element))}
    >
      {vibes.map((v, i) => (
        <option className="text-lg" value={i} key={v}>
          {v}
        </option>
      ))}
    </select>
  )
}
