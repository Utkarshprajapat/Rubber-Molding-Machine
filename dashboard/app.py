import time
from datetime import datetime

import numpy as np
import pandas as pd
import streamlit as st

# =====================================================
# Synthetic data & algorithms for the simulator
# =====================================================


def gaussian():
    return np.random.normal(0, 1)


def generate_sensor_snapshot(temperature_stress=0.0, pressure_stress=0.0):
    temperature = 190 + gaussian() * 8 + temperature_stress
    pressure = 100 + gaussian() * 5 + pressure_stress
    cycle_time = 40 + gaussian() * 2
    vibration = 5 + abs(gaussian())
    humidity = 50 + gaussian() * 4

    return {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "temperature": float(round(temperature, 2)),
        "pressure": float(round(pressure, 2)),
        "cycle_time": float(round(cycle_time, 2)),
        "vibration": float(round(vibration, 2)),
        "humidity": float(round(humidity, 2)),
    }


def calculate_quality_score(snapshot):
    temp_penalty = max(0, snapshot["temperature"] - 210) * 0.8
    pressure_penalty = max(0, snapshot["pressure"] - 115) * 0.9
    vibration_penalty = snapshot["vibration"] * 1.5
    base_score = 100 - temp_penalty - pressure_penalty - vibration_penalty
    return max(50.0, min(100.0, base_score))


def calculate_defect_probability(snapshot, quality_score):
    stress_factor = (
        max(0, snapshot["temperature"] - 205)
        + max(0, snapshot["pressure"] - 110)
        + snapshot["vibration"] * 2
    ) / 300.0
    quality_factor = (100 - quality_score) / 150.0
    prob = stress_factor + quality_factor
    return float(max(0.01, min(0.9, prob)))


def derive_batch_delta(snapshot):
    return max(1, int(round(60.0 / max(1e-3, snapshot["cycle_time"]))))


# =====================================================
# OOP-style core: ManufacturingUnit, ProductionBatch, AlertSystem
# =====================================================


class ManufacturingUnit:
    def __init__(self):
        self.state = "Idle"
        self.cpu_utilization = 0

    def evaluate(self, snapshot, quality_score):
        load_factor = snapshot["temperature"] / 220.0
        self.cpu_utilization = min(99, int(round(40 + load_factor * 50)))
        if quality_score > 85:
            self.state = "Stable"
        elif quality_score > 70:
            self.state = "Adaptive"
        else:
            self.state = "At Risk"

        return {
            "state": self.state,
            "throughput": max(30, int(round(60.0 / max(1e-3, snapshot["cycle_time"])) * 10)),
            "load_balance": int(round(load_factor * 100)),
            "energy_usage": float(round(35 + load_factor * 12, 1)),
            "cpu_utilization": self.cpu_utilization,
            "note": "Optimizer rerouting workloads"
            if self.state == "At Risk"
            else "Nominal routing via sensor bus",
        }


class ProductionBatch:
    def __init__(self, batch_id="Batch-042", target_output=1200):
        self.batch_id = batch_id
        self.target_output = target_output
        self.units_produced = 0

    def update(self, snapshot):
        self.units_produced += derive_batch_delta(snapshot)
        progress = min(100, int(round(self.units_produced / self.target_output * 100)))
        if progress > 66:
            quality_gate = "Stage 3"
        elif progress > 33:
            quality_gate = "Stage 2"
        else:
            quality_gate = "Stage 1"
        return {
            "batch_id": self.batch_id,
            "units_produced": self.units_produced,
            "target_output": self.target_output,
            "progress": progress,
            "quality_gate": quality_gate,
            "next_action": "Prep final QA" if progress > 90 else "Continue composite curing",
        }


class AlertSystem:
    def __init__(self):
        self.buffer = []
        self.counter = 0

    def _ts(self):
        return datetime.now().strftime("%H:%M:%S")

    def _make(self, severity, title, description):
        self.counter += 1
        return {
            "id": f"alert-{self.counter}",
            "severity": severity,
            "title": title,
            "description": description,
            "timestamp": self._ts(),
        }

    def evaluate(self, snapshot, quality_score, defect_prob):
        alerts = []
        if snapshot["temperature"] > 220:
            alerts.append(
                self._make(
                    "critical",
                    "Thermal spike detected",
                    "Brake lining overheating beyond spec",
                )
            )
        if snapshot["pressure"] > 120:
            alerts.append(
                self._make(
                    "warning",
                    "Hydraulic pressure drift",
                    "Check piston alignment and seals",
                )
            )
        if defect_prob > 0.35:
            alerts.append(
                self._make(
                    "critical",
                    "Defect probability high",
                    f"Predictive model estimates {defect_prob * 100:.1f}%",
                )
            )
        if quality_score < 75:
            alerts.append(
                self._make(
                    "warning",
                    "Quality score degrading",
                    "Auto-tuning algorithm engaged",
                )
            )

        self.buffer = (alerts + self.buffer)[:30]
        return alerts

    def history(self):
        return self.buffer


# =====================================================
# Streamlit state & UI sections
# =====================================================


def init_state():
    if "controls" not in st.session_state:
        st.session_state.controls = {
            "running": True,
            "temperature_stress": 8.0,
            "pressure_stress": 4.0,
            "speed_multiplier": 1.0,
        }
    if "history" not in st.session_state:
        st.session_state.history = []
    if "quality_score" not in st.session_state:
        st.session_state.quality_score = 92.0
    if "defect_prob" not in st.session_state:
        st.session_state.defect_prob = 0.08
    if "machine" not in st.session_state:
        st.session_state.machine = {
            "state": "Stable",
            "throughput": 320,
            "load_balance": 60,
            "energy_usage": 46.0,
            "cpu_utilization": 58,
            "note": "Ready to ramp batches",
        }
    if "batch" not in st.session_state:
        st.session_state.batch = {
            "batch_id": "Batch-042",
            "progress": 15,
            "units_produced": 180,
            "target_output": 1200,
            "quality_gate": "Stage 1",
            "next_action": "Align composite spool",
        }
    if "alerts" not in st.session_state:
        st.session_state.alerts = []
    if "unit" not in st.session_state:
        st.session_state.unit = ManufacturingUnit()
    if "batch_engine" not in st.session_state:
        st.session_state.batch_engine = ProductionBatch()
    if "alert_engine" not in st.session_state:
        st.session_state.alert_engine = AlertSystem()


def render_sidebar():
    st.sidebar.title("Simulation Controls")

    running = st.sidebar.toggle(
        "Simulation running",
        value=st.session_state.controls["running"],
    )
    st.session_state.controls["running"] = running

    temp = st.sidebar.slider(
        "Temperature stress (%)",
        0.0,
        50.0,
        st.session_state.controls["temperature_stress"],
        step=2.0,
    )
    pres = st.sidebar.slider(
        "Pressure stress (%)",
        0.0,
        50.0,
        st.session_state.controls["pressure_stress"],
        step=2.0,
    )
    speed = st.sidebar.slider(
        "Speed multiplier",
        0.5,
        3.0,
        st.session_state.controls["speed_multiplier"],
        step=0.1,
    )

    st.session_state.controls["temperature_stress"] = temp
    st.session_state.controls["pressure_stress"] = pres
    st.session_state.controls["speed_multiplier"] = speed

    st.sidebar.markdown("---")
    st.sidebar.subheader("Subjects Stack")
    st.sidebar.write("- Probability & Random Processes")
    st.sidebar.write("- Computer Architecture & Org.")
    st.sidebar.write("- Design & Analysis of Algorithms")
    st.sidebar.write("- Object-Oriented Programming")


def render_header():
    col1, col2 = st.columns([2, 1])
    with col1:
        st.caption("Brake Shoes & Brake Pads Manufacturing Simulator")
        st.title("Real-time Operations Control")
    with col2:
        st.caption("Academic Backbone")
        st.markdown(
            """
            - Probability  
            - Architecture  
            - Algorithms  
            - OOP  
            """
        )


def render_top_metrics(latest):
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Temperature (°C)", f"{latest['temperature']:.1f}")
    c2.metric("Pressure (psi)", f"{latest['pressure']:.1f}")
    c3.metric("Cycle Time (s)", f"{latest['cycle_time']:.2f}")
    c4.metric("Quality Score", f"{st.session_state.quality_score:.1f} %")
    c5.metric("Defect Probability", f"{st.session_state.defect_prob * 100:.2f} %")


def render_machine_batch_panels():
    machine = st.session_state.machine
    batch = st.session_state.batch

    c1, c2 = st.columns(2)

    with c1:
        st.subheader("Machine Status")
        st.write(f"**State:** {machine['state']}")
        st.write(f"**Throughput:** {machine['throughput']} units/hr")
        st.write(f"**Load balance:** {machine['load_balance']} %")
        st.write(f"**Energy usage:** {machine['energy_usage']} kWh")
        st.write(f"**CPU utilization:** {machine['cpu_utilization']} %")
        st.caption(machine["note"])

    with c2:
        st.subheader("Batch Overview")
        st.write(f"**Batch ID:** {batch['batch_id']}")
        st.write(f"**Completion:** {batch['progress']} %")
        st.progress(batch["progress"] / 100.0)
        st.write(f"**Units produced:** {batch['units_produced']}")
        st.write(f"**Target output:** {batch['target_output']}")
        st.write(f"**Quality gate:** {batch['quality_gate']}")
        st.caption(batch["next_action"])


def render_charts():
    hist = st.session_state.history
    if not hist:
        st.info("Waiting for telemetry...")
        return
    df = pd.DataFrame(hist)

    st.subheader("Real-time Telemetry")
    tab1, tab2 = st.tabs(["Temperature / Pressure / Cycle Time", "Raw Data"])

    with tab1:
        st.line_chart(
            df.set_index("timestamp")[["temperature", "pressure", "cycle_time"]]
        )
    with tab2:
        st.dataframe(df.tail(50), use_container_width=True, height=260)


def render_alerts():
    st.subheader("Alert Center")
    alerts = st.session_state.alerts
    if not alerts:
        st.caption("No alerts triggered.")
        return
    for a in alerts[:6]:
        color = {
            "info": "#38bdf8",
            "warning": "#eab308",
            "critical": "#f97373",
        }.get(a["severity"], "#38bdf8")
        st.markdown(
            f"""
            <div style="
                border-radius: 12px;
                padding: 10px 12px;
                margin-bottom: 8px;
                border: 1px solid {color}40;
                background-color: {color}15;">
                <strong style="color:{color}">{a['title']}</strong>
                <span style="float:right; font-size: 0.8rem; color:#9ca3af;">{a['timestamp']}</span>
                <div style="font-size:0.9rem; color:#e5e7eb;">{a['description']}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def render_system_flow():
    st.subheader("Sensor → CPU → Algorithms → Alerts")
    cols = st.columns(4)
    steps = [
        ("Sensors", "Temperature, Pressure, Cycle Time feed raw signals"),
        ("Sensor Bus & CPU", "Architecture layer optimizes throughput"),
        ("Algorithm Core", "Quality, thresholds, predictive alerts"),
        ("OOP Units", "ManufacturingUnit, Sensor, ProductionBatch, AlertSystem"),
    ]
    for col, (title, desc) in zip(cols, steps):
        with col:
            st.markdown(f"**{title}**")
            st.caption(desc)


def simulation_step():
    controls = st.session_state.controls
    snapshot = generate_sensor_snapshot(
        temperature_stress=controls["temperature_stress"],
        pressure_stress=controls["pressure_stress"],
    )
    q = calculate_quality_score(snapshot)
    p = calculate_defect_probability(snapshot, q)

    machine = st.session_state.unit.evaluate(snapshot, q)
    batch = st.session_state.batch_engine.update(snapshot)
    st.session_state.alert_engine.evaluate(snapshot, q, p)

    st.session_state.history.append(snapshot)
    st.session_state.history = st.session_state.history[-80:]
    st.session_state.quality_score = q
    st.session_state.defect_prob = p
    st.session_state.machine = machine
    st.session_state.batch = batch
    st.session_state.alerts = st.session_state.alert_engine.history()


def main():
    st.set_page_config(
        page_title="Brake Manufacturing Simulator",
        page_icon="🛠️",
        layout="wide",
    )
    init_state()
    render_sidebar()
    render_header()

    placeholder_metrics = st.empty()
    placeholder_charts = st.empty()
    placeholder_panels = st.empty()
    placeholder_alerts = st.empty()
    placeholder_flow = st.empty()

    if st.session_state.controls["running"]:
        steps = int(3 * st.session_state.controls["speed_multiplier"])
        for _ in range(max(1, steps)):
            simulation_step()
            time.sleep(0.2 / st.session_state.controls["speed_multiplier"])

    latest = (
        st.session_state.history[-1]
        if st.session_state.history
        else generate_sensor_snapshot()
    )

    with placeholder_metrics.container():
        render_top_metrics(latest)

    with placeholder_charts.container():
        render_charts()

    with placeholder_panels.container():
        render_machine_batch_panels()

    with placeholder_alerts.container():
        render_alerts()

    with placeholder_flow.container():
        render_system_flow()


if __name__ == "__main__":
    main()
