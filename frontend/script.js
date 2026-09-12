// Slope Safe – Frontend REST API connector
const API_BASE = window.location.origin;

async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.error("Health check failed:", err);
    return null;
  }
}

async function fetchLocations() {
  try {
    const res = await fetch(`${API_BASE}/locations`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load locations:", err);
    return [];
  }
}

async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load alerts:", err);
    return [];
  }
}

async function fetchModelPerformance() {
  try {
    const res = await fetch(`${API_BASE}/model-performance`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load performance metrics:", err);
    return null;
  }
}

async function predictRisk(payload) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || err.detail || "Prediction request failed");
  }
  return await res.json();
}

async function submitFieldReport(payload) {
  const res = await fetch(`${API_BASE}/field-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || err.detail || "Failed to submit field report");
  }
  return await res.json();
}

async function simulateAlert(payload) {
  const res = await fetch(`${API_BASE}/alerts/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

function getRiskBadge(level) {
  const l = String(level).toUpperCase();
  if (l === "CRITICAL") return `<span class="badge-pill badge-critical">🔴 Critical</span>`;
  if (l === "HIGH") return `<span class="badge-pill badge-high">🟠 High</span>`;
  if (l === "MODERATE") return `<span class="badge-pill badge-moderate">🟡 Moderate</span>`;
  return `<span class="badge-pill badge-low">🟢 Low</span>`;
}
