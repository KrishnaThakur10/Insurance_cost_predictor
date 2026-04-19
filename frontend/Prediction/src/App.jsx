import { useState, useRef } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/predict";

const steps = [
  { id: "personal", label: "Personal Info", icon: "👤" },
  { id: "health", label: "Health Details", icon: "🩺" },
  { id: "location", label: "Location", icon: "📍" },
];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {steps.map((step, i) => (
        <div key={step.id} className={`step ${i === current ? "active" : i < current ? "done" : ""}`}>
          <div className="step-circle">
            {i < current ? "✓" : step.icon}
          </div>
          <span className="step-label">{step.label}</span>
          {i < steps.length - 1 && <div className={`step-line ${i < current ? "filled" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function RangeInput({ label, name, value, min, max, step, unit, onChange, hint }) {
  return (
    <div className="range-group">
      <div className="range-header">
        <label>{label}</label>
        <span className="range-value">{value}{unit}</span>
      </div>
      <input
        type="range" name={name} min={min} max={max} step={step}
        value={value} onChange={onChange} className="range-slider"
      />
      <div className="range-bounds"><span>{min}{unit}</span><span>{max}{unit}</span></div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function ToggleGroup({ label, name, options, value, onChange }) {
  return (
    <div className="toggle-group">
      <label>{label}</label>
      <div className="toggle-options">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`toggle-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => onChange({ target: { name, value: opt.value } })}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: 30, sex: "male", bmi: 24.5,
    children: 0, smoker: "no", region: "southeast",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post(API_URL, {
        age: Number(form.age), sex: form.sex,
        bmi: Number(form.bmi), children: Number(form.children),
        smoker: form.smoker, region: form.region,
      });
      if (res.data.success) {
        setResult(res.data.predicted_insurance_cost);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        setError(res.data.error || "Prediction failed.");
      }
    } catch {
      setError("Could not connect to the prediction API. Make sure it's running on port 8000.");
    }
    setLoading(false);
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
    if (bmi < 25) return { label: "Normal", color: "#34d399" };
    if (bmi < 30) return { label: "Overweight", color: "#fbbf24" };
    return { label: "Obese", color: "#f87171" };
  };

  const bmiInfo = getBmiCategory(Number(form.bmi));

  const regionLabels = {
    southeast: "Southeast 🌴", southwest: "Southwest 🌵",
    northeast: "Northeast 🏙️", northwest: "Northwest 🏔️",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0c14;
          --surface: #111520;
          --surface2: #161b2e;
          --border: rgba(255,255,255,0.07);
          --border-active: rgba(99,179,237,0.5);
          --text: #c8d3e8;
          --text-muted: #5a6a8a;
          --text-bright: #f0f4ff;
          --accent: #63b3ed;
          --accent2: #76e4f7;
          --accent-glow: rgba(99,179,237,0.15);
          --success: #68d391;
          --warning: #fbbf24;
          --danger: #f87171;
          --radius: 16px;
          --font-display: 'Instrument Serif', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }

        body {
          background: var(--bg);
          font-family: var(--font-body);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Background grid */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .app-wrapper {
          position: relative;
          z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 48px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-glow);
          border: 1px solid rgba(99,179,237,0.25);
          color: var(--accent);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .header h1 {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 58px);
          font-weight: 400;
          color: var(--text-bright);
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }

        .header h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .header p {
          color: var(--text-muted);
          font-size: 16px;
          font-weight: 300;
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Glow orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.12;
        }
        .orb-1 { width: 500px; height: 500px; background: #2563eb; top: -100px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: #0ea5e9; bottom: 0; right: -100px; }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          margin-bottom: 36px;
          gap: 0;
          position: relative;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          max-width: 140px;
        }

        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .step.active .step-circle {
          border-color: var(--accent);
          background: var(--accent-glow);
          box-shadow: 0 0 20px rgba(99,179,237,0.3);
        }

        .step.done .step-circle {
          border-color: var(--success);
          background: rgba(104,211,145,0.1);
          color: var(--success);
          font-size: 16px;
        }

        .step-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          margin-top: 8px;
          text-align: center;
          text-transform: uppercase;
        }

        .step.active .step-label { color: var(--accent); }
        .step.done .step-label { color: var(--success); }

        .step-line {
          position: absolute;
          top: 22px;
          left: calc(50% + 22px);
          right: calc(-50% + 22px);
          height: 2px;
          background: var(--border);
          z-index: 0;
        }
        .step-line.filled { background: var(--success); }

        /* Card */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          margin-bottom: 20px;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--text-bright);
          margin-bottom: 6px;
          font-weight: 400;
        }

        .card-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        /* Range */
        .range-group { margin-bottom: 24px; }
        .range-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .range-header label {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: var(--text);
          text-transform: uppercase;
        }
        .range-value {
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--accent);
        }
        .range-slider {
          width: 100%;
          -webkit-appearance: none;
          height: 4px;
          background: var(--surface2);
          border-radius: 99px;
          outline: none;
          cursor: pointer;
        }
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 12px rgba(99,179,237,0.5);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .range-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .range-bounds {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 6px;
        }
        .hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }

        /* BMI Badge */
        .bmi-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 4px;
          border: 1px solid;
        }

        /* Toggle */
        .toggle-group { margin-bottom: 24px; }
        .toggle-group > label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: var(--text);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .toggle-options { display: flex; gap: 10px; flex-wrap: wrap; }
        .toggle-btn {
          flex: 1;
          min-width: 90px;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .toggle-btn:hover { border-color: var(--accent); color: var(--text-bright); }
        .toggle-btn.selected {
          border-color: var(--accent);
          background: var(--accent-glow);
          color: var(--accent);
          font-weight: 500;
        }

        /* Region Grid */
        .region-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        .region-btn {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .region-btn:hover { border-color: var(--accent); color: var(--text-bright); }
        .region-btn.selected {
          border-color: var(--accent);
          background: var(--accent-glow);
          color: var(--accent);
          font-weight: 500;
        }

        /* Summary */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        .summary-item {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
          text-align: center;
        }
        .summary-item .s-label {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .summary-item .s-value {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--text-bright);
        }

        /* Nav Buttons */
        .nav-buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-back {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-back:hover { border-color: var(--accent); color: var(--text-bright); }

        .btn-next {
          flex: 2;
          padding: 14px 24px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          color: white;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .btn-next::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-next:hover::after { opacity: 1; }
        .btn-next:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.35); }
        .btn-next:active { transform: translateY(0); }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* Result */
        .result-card {
          border-color: rgba(99,179,237,0.25);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .result-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        .result-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .result-amount {
          font-family: var(--font-display);
          font-size: clamp(48px, 10vw, 72px);
          font-weight: 400;
          color: var(--text-bright);
          line-height: 1;
          margin-bottom: 8px;
        }

        .result-amount .currency {
          font-size: 0.5em;
          vertical-align: super;
          color: var(--accent);
        }

        .result-note {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .result-factors {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .factor-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 99px;
          background: var(--surface2);
          border: 1px solid var(--border);
          font-size: 12px;
          color: var(--text);
        }

        .btn-reset {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .btn-reset:hover { border-color: var(--accent); color: var(--accent); }

        .error-msg {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.3);
          color: #fca5a5;
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 13px;
          margin-top: 12px;
          line-height: 1.5;
        }

        .loading-pulse {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
        }
        .loading-pulse span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 1.2s ease-in-out infinite;
        }
        .loading-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .loading-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }

        @media (max-width: 480px) {
          .card { padding: 20px; }
          .summary-grid { grid-template-columns: repeat(2, 1fr); }
          .nav-buttons { flex-direction: column; }
          .btn-back { flex: none; }
          .region-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="app-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-badge">
            <span>⚕</span> AI-Powered Estimator
          </div>
          <h1>Medical Insurance<br /><em>Cost Predictor</em></h1>
          <p>Get an instant estimate based on your personal health profile using machine learning.</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <Card>
            <div className="card-title">Personal Information</div>
            <div className="card-subtitle">Basic demographics that affect your insurance premium</div>

            <RangeInput
              label="Age" name="age" value={form.age}
              min={18} max={80} step={1} unit=" yrs"
              onChange={handleChange}
            />

            <ToggleGroup
              label="Biological Sex" name="sex"
              options={[{ value: "male", label: "Male", icon: "♂" }, { value: "female", label: "Female", icon: "♀" }]}
              value={form.sex} onChange={handleChange}
            />

            <ToggleGroup
              label="Number of Children" name="children"
              options={[0,1,2,3,4,5].map(n => ({ value: String(n), label: n === 0 ? "None" : String(n) }))}
              value={String(form.children)} onChange={handleChange}
            />

            <div className="nav-buttons">
              <button className="btn-next" onClick={() => setStep(1)}>Continue →</button>
            </div>
          </Card>
        )}

        {/* Step 1: Health Details */}
        {step === 1 && (
          <Card>
            <div className="card-title">Health Details</div>
            <div className="card-subtitle">Health indicators that significantly impact your premium</div>

            <div className="range-group">
              <div className="range-header">
                <label>BMI (Body Mass Index)</label>
                <span className="range-value">{Number(form.bmi).toFixed(1)}</span>
              </div>
              <input
                type="range" name="bmi" min={10} max={55} step={0.1}
                value={form.bmi} onChange={handleChange} className="range-slider"
              />
              <div className="range-bounds"><span>10</span><span>55</span></div>
              <div style={{ marginTop: "8px" }}>
                <span className="bmi-badge" style={{ color: bmiInfo.color, borderColor: bmiInfo.color, background: `${bmiInfo.color}15` }}>
                  ● {bmiInfo.label}
                </span>
              </div>
            </div>

            <ToggleGroup
              label="Smoking Status" name="smoker"
              options={[{ value: "no", label: "Non-Smoker", icon: "🚭" }, { value: "yes", label: "Smoker", icon: "🚬" }]}
              value={form.smoker} onChange={handleChange}
            />

            {form.smoker === "yes" && (
              <div className="error-msg" style={{ background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.3)", color: "#fde68a" }}>
                ⚠️ Smoking is a major cost driver — it can increase premiums by 2–4×.
              </div>
            )}

            <div className="nav-buttons">
              <button className="btn-back" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-next" onClick={() => setStep(2)}>Continue →</button>
            </div>
          </Card>
        )}

        {/* Step 2: Region + Summary */}
        {step === 2 && (
          <Card>
            <div className="card-title">Location & Review</div>
            <div className="card-subtitle">Select your IN region and review your details</div>

            <div className="toggle-group">
              <label>Region</label>
              <div className="region-grid">
                {["southeast","southwest","northeast","northwest"].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`region-btn ${form.region === r ? "selected" : ""}`}
                    onClick={() => handleChange({ target: { name: "region", value: r } })}
                  >
                    {regionLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Your Profile Summary</div>

            <div className="summary-grid">
              {[
                { label: "Age", value: `${form.age} yrs` },
                { label: "Sex", value: form.sex === "male" ? "Male ♂" : "Female ♀" },
                { label: "BMI", value: Number(form.bmi).toFixed(1) },
                { label: "Children", value: form.children },
                { label: "Smoker", value: form.smoker === "yes" ? "Yes 🚬" : "No 🚭" },
                { label: "Region", value: form.region.charAt(0).toUpperCase() + form.region.slice(1) },
              ].map(item => (
                <div key={item.label} className="summary-item">
                  <div className="s-label">{item.label}</div>
                  <div className="s-value">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="nav-buttons" style={{ marginTop: 20 }}>
              <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-next" onClick={handleSubmit} disabled={loading}>
                {loading ? "Predicting..." : "Predict My Cost ✦"}
              </button>
            </div>

            {loading && (
              <div className="loading-pulse">
                <span /><span /><span />
              </div>
            )}

            {error && <div className="error-msg">⚠️ {error}</div>}
          </Card>
        )}

        {/* Result */}
        {result !== null && (
          <Card className="result-card" ref={resultRef}>
            <div className="result-label">Estimated Annual Premium</div>
            <div className="result-amount">
              <span className="currency">₹</span>
              {result.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </div>
            <div className="result-note">Based on your profile — actual costs may vary by insurer.</div>

            <div className="result-factors">
              {[
                { icon: form.smoker === "yes" ? "🚬" : "🚭", text: form.smoker === "yes" ? "Smoker — high risk" : "Non-smoker" },
                { icon: "📊", text: `BMI ${Number(form.bmi).toFixed(1)} — ${bmiInfo.label}` },
                { icon: "📍", text: `${form.region.charAt(0).toUpperCase() + form.region.slice(1)} US` },
                { icon: "👤", text: `${form.age} yrs, ${form.children} child${form.children !== 1 ? "ren" : ""}` },
              ].map(f => (
                <span key={f.text} className="factor-chip">{f.icon} {f.text}</span>
              ))}
            </div>

            <button className="btn-reset" onClick={() => { setResult(null); setStep(0); setError(null); }}>
              ↺ Start New Prediction
            </button>
          </Card>
        )}
      </div>
    </>
  );
}