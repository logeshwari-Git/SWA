function Crisis() {
  return (
    <div className="content-card crisis-card">
      <h2>Emergency & Crisis Support</h2>
      <p className="muted" style={{ marginBottom: "18px" }}>
        If you feel unsafe, overwhelmed, or at risk of harming yourself, please contact immediate support right away.
      </p>

      <div className="crisis-grid">
        <div className="crisis-item">
          <h3>Tele-MANAS</h3>
          <p>14416</p>
          <p>1-800-891-4416</p>
        </div>

        <div className="crisis-item">
          <h3>iCALL</h3>
          <p>022-25521111</p>
        </div>

        <div className="crisis-item">
          <h3>NIMHANS Suicide Prevention</h3>
          <p>080-26685948</p>
          <p>9480829670</p>
        </div>

        <div className="crisis-item">
          <h3>Sahai</h3>
          <p>1080-25497777</p>
          <p>Mon – Sat, 10 AM – 8 PM</p>
        </div>

        <div className="crisis-item">
          <h3>Parivarthan Counseling</h3>
          <p>7676602602</p>
          <p>Mon – Fri, 4 PM – 10 PM</p>
        </div>

        <div className="crisis-item">
          <h3>Campus Counselor</h3>
          <p>Use the counselor booking page for non-emergency support.</p>
          <p>Book an appointment from the Counselor section.</p>
        </div>
      </div>

      <div className="content-card crisis-disclaimer" style={{ marginTop: "18px" }}>
        <h3 style={{ marginBottom: "10px" }}>Disclaimer</h3>
        <ol className="steps">
          <li>The information provided here is intended solely for informational purposes.</li>
          <li>The helpline numbers and contact details have been aggregated from publicly available sources.</li>
          <li>They are a resource to facilitate access to mental health and suicide prevention support services.</li>
          <li>If you know someone in crisis, we suggest you take immediate help from a qualified mental health professional.</li>
        </ol>
      </div>
    </div>
  );
}

export default Crisis;
