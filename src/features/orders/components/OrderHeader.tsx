function OrderHeader({ name }: { name: string }) {
  return (
    <div className="race-header">
      <h1>{name}</h1>
      <div className="race-header-line" />
    </div>
  )
}

export default OrderHeader
