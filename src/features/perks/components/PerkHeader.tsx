function PerkHeader({ name }: { name: string }) {
    return (
      <div className="perk-header">
        <h1>{name}</h1>
        <div className="perk-header-line" />
      </div>
    )
  }
  
  export default PerkHeader
  