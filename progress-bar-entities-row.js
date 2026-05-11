class ProgressBarEntitiesRow extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity ist erforderlich");
    }
    this.config = {
      mode: "auto",
      max_value: 100,
      min_value: 0,
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _computeValues() {
    const hass = this._hass;
    const entityId = this.config.entity;
    const stateObj = hass.states[entityId];

    const rawValue = stateObj ? parseFloat(stateObj.state) : NaN;
    const icon = stateObj?.attributes.icon || "mdi:help-circle";
    const name =
      this.config.name ||
      stateObj?.attributes.friendly_name ||
      entityId;
    const unit = stateObj?.attributes.unit_of_measurement || "";
    const unavailable = !stateObj || isNaN(rawValue);

    // Minimum bestimmen
    let min = parseFloat(this.config.min_value) || 0;
    if (this.config.min_entity) {
      const minState = hass.states[this.config.min_entity];
      if (minState && !isNaN(parseFloat(minState.state))) {
        min = parseFloat(minState.state);
      }
    }

    // Maximum bestimmen
    let max = parseFloat(this.config.max_value) ?? 100;
    if (this.config.max_entity) {
      const maxState = hass.states[this.config.max_entity];
      if (maxState && !isNaN(parseFloat(maxState.state))) {
        max = parseFloat(maxState.state);
      }
    }

    // Prozentwert berechnen, auf 0–100 clampen
    const percent =
      !unavailable && max > min
        ? ((rawValue - min) / (max - min)) * 100
        : 0;
    const value = Math.min(Math.max(percent, 0), 100);

    return { stateObj, rawValue, icon, name, unit, min, max, value, unavailable };
  }

  _isRowMode() {
    const mode = this.config.mode;
    if (mode === "row") return true;
    if (mode === "card") return false;
    // auto: row wenn innerhalb einer entities-card
    return !!this.closest("hui-entities-card");
  }

  _render() {
    if (!this._hass) return;

    const { rawValue, icon, name, unit, min, max, value, unavailable } =
      this._computeValues();

    const isRow = this._isRowMode();

    // Shadow DOM beim ersten Render initialisieren
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    const displayValue = unavailable
      ? "N/A"
      : `${Math.round(rawValue)}${unit ? " " + unit : ""}`;
    const tooltip = `Min: ${min} · Max: ${max}`;

    const barColor = unavailable
      ? "var(--disabled-color, #9e9e9e)"
      : value > 66
      ? "var(--success-color, #4caf50)"
      : value > 33
      ? "var(--warning-color, #ff9800)"
      : "var(--error-color, #f44336)";

    const styles = `
      :host {
        display: block;
      }
      /* Exaktes Layout der HA standard entity-row */
      .row {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 0 16px;
        min-height: 52px;
        box-sizing: border-box;
      }
      /* Icon-Bereich: 40px fix, wie ha-state-icon in entity-row */
      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        flex-shrink: 0;
        margin-right: 8px;
        color: var(--paper-item-icon-color, var(--state-icon-color, #44739e));
      }
      /* Name: nimmt den verfügbaren Platz links */
      .name {
        flex: 1;
        min-width: 0;
        font-size: var(--paper-font-body1_-_font-size, 14px);
        font-weight: var(--paper-font-body1_-_font-weight, 400);
        line-height: var(--paper-font-body1_-_line-height, 20px);
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Rechte Seite: Bar + Wert, zusammen so breit wie der State-Bereich */
      .right {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        gap: 8px;
      }
      .bar-container {
        width: 100px;
        background: var(--divider-color, #e0e0e0);
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
      }
      .bar {
        height: 100%;
        width: ${value}%;
        background: ${barColor};
        border-radius: 4px;
        transition: width 0.5s ease;
      }
      /* State-Text: wie .state in standard entity-row */
      .state {
        font-size: var(--paper-font-body1_-_font-size, 14px);
        color: var(--primary-text-color);
        text-align: right;
        white-space: nowrap;
        min-width: 42px;
      }
      /* Card-Modus */
      ha-card {
        padding: 16px;
      }
      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .card-header .icon {
        margin-right: 8px;
      }
      .card-header .name {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .card-bar-container {
        background: var(--divider-color, #e0e0e0);
        height: 16px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      .card-bar {
        height: 100%;
        width: ${value}%;
        background: ${barColor};
        border-radius: 8px;
        transition: width 0.5s ease;
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--secondary-text-color);
      }
    `;

    const rowTemplate = `
      <style>${styles}</style>
      <div class="row" title="${tooltip}">
        <div class="icon-wrapper">
          <ha-icon icon="${icon}"></ha-icon>
        </div>
        <span class="name">${name}</span>
        <div class="right">
          <div class="bar-container">
            <div class="bar"></div>
          </div>
          <span class="state">${displayValue}</span>
        </div>
      </div>
    `;

    const cardTemplate = `
      <style>${styles}</style>
      <ha-card>
        <div class="card-header" title="${tooltip}">
          <ha-icon class="icon" icon="${icon}"></ha-icon>
          <span class="name">${name}</span>
        </div>
        <div class="card-bar-container">
          <div class="card-bar"></div>
        </div>
        <div class="card-footer">
          <span>${Math.round(min)}${unit ? " " + unit : ""}</span>
          <span>${displayValue}</span>
          <span>${Math.round(max)}${unit ? " " + unit : ""}</span>
        </div>
      </ha-card>
    `;

    this.shadowRoot.innerHTML = isRow ? rowTemplate : cardTemplate;
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
    };
  }
}

customElements.define("progress-bar-entities-row", ProgressBarEntitiesRow);
