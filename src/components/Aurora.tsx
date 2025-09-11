
export default function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <div className="aurora__blob" style={{ top: "-10vmax", left: "-10vmax" }} />
      <div
        className="aurora__blob aurora__blob--2"
        style={{ bottom: "-15vmax", right: "-10vmax" }}
      />
    </div>
  );
}
