// Dein JavaScript-Code kommt hier rein
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

    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Example-card">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    const entityId = this.config.entity;
    const stateObj = hass.states[entityId];
    const icon = stateObj?.attributes.icon || 'mdi:help-circle';
    const rawValue = parseFloat(stateObj?.state || 0);

    // Minimum bestimmen
    let min = 0;
    if (this.config.min_entity) {
      const minEntity = hass.states[this.config.min_entity];
      if (minEntity && !isNaN(parseFloat(minEntity.state))) {
        min = parseFloat(minEntity.state);
      }
    } else if (this.config.min_value !== undefined && !isNaN(this.config.min_value)) {
      min = parseFloat(this.config.min_value);
    }

    // Maximum bestimmen
    let max = 100;
    if (this.config.max_entity) {
      const maxEntity = hass.states[this.config.max_entity];
      if (maxEntity && !isNaN(parseFloat(maxEntity.state))) {
        max = parseFloat(maxEntity.state);
      }
    } else if (this.config.max_value !== undefined && !isNaN(this.config.max_value)) {
      max = parseFloat(this.config.max_value);
    }

    // Prozentwert berechnen
    const percent = max > min ? ((rawValue - min) / (max - min)) * 100 : 0;
    const value = Math.min(Math.max(percent, 0), 100);
    const color = value > 60 ? 'green' : value > 30 ? 'orange' : 'red';

    // Name zusammensetzen
    const baseName = this.config.name || stateObj?.attributes.friendly_name || 'Unbekannt';
    const name = baseName;
    const tooltip = `Min: ${min} - Max: ${max}`;

    // Modus erkennen
    const isRow =
      this.config.mode === 'row' ||
      (this.config.mode === 'auto' && this.closest("hui-entities-card"));

    const styles = `
      .bar-container {
        background: #ccc;
        height: 16px;
        border-radius: 8px;
        overflow: hidden;
      }
      .bar {
        height: 100%;
        background: ${color};
        width: ${value}%;
        transition: width 0.5s;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
      }
      .card {
        padding: 16px;
      }
      ha-icon {
        margin-right: 8px;
      }
    `;

    const template = `
      <style>${styles}</style>
      ${isRow ? `
        <div class="row">
          <div title="${tooltip}" style="display: flex; align-items: center;">
            <ha-icon icon="${icon}"></ha-icon>
            <ha-state-icon .hass=${hass} .stateObj=${stateObj}></ha-state-icon>
            <span>${name}</span>
          </div>
          <div style="flex: 1; margin: 0 12px;" class="bar-container">
            <div class="bar"></div>
          </div>
          <div class="state">${Math.round(rawValue)}</div>
        </div>
      ` : `
        <ha-card header="${name}" title="${tooltip}">
          <div class="card">
            <div style="text-align: center;">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="bar-container">
              <div class="bar"></div>
            </div>
            <p style="text-align: center; margin-top: 8px;">${Math.round(rawValue)}</p>
          </div>
        </ha-card>
      `}
    `;

    this.shadowRoot.innerHTML = template;
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return {
      rows: 3,
      columns: 6,
      min_rows: 3
    };
  }
}

customElements.define('battery-bar-card', BatteryBarCard);
