export default function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <div className="aurora__blob gradient-morph" style={{ top: "-10vmax", left: "-10vmax" }} />
      <div
        className="aurora__blob aurora__blob--2 gradient-morph"
        style={{ bottom: "-15vmax", right: "-10vmax" }}
      />
      {/* Additional floating orbs for more atmosphere */}
      <div
        className="aurora__blob breathe"
        style={{
          top: "20%",
          right: "10%",
          width: "30vmax",
          height: "30vmax",
          background: "radial-gradient(closest-side, rgba(255, 133, 225, 0.15), transparent 70%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="aurora__blob float-animation"
        style={{
          bottom: "30%",
          left: "15%",
          width: "25vmax",
          height: "25vmax",
          background: "radial-gradient(closest-side, rgba(34, 211, 238, 0.12), transparent 70%)",
          animationDelay: "-15s",
        }}
      />
    </div>
  );
}
