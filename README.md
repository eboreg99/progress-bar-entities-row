# Progress Bar Entity Row for Home Assistant

A customizable Lovelace element to display a progress bar, usable both as an inline entity row and as a standalone card. Supports dynamic min/max values via entity or fixed config.

---

## Features

- Works as inline row in an `entities` card or as standalone `ha-card`
- Dynamic min/max from other entities
- Configurable fixed min/max values
- Automatic mode detection (`auto`): row when inside an entities card, card otherwise
- Uses HA theme colors (`--success-color`, `--warning-color`, `--error-color`)
- Displays unit of measurement automatically
- Graceful handling of unavailable entities

---

## Installation

### Via HACS

1. Add this repo as a custom repository in HACS:
   - URL: `https://github.com/eboreg99/progress-bar-entities-row`
   - Type: Lovelace
2. Install via HACS.

### Manually

1. Copy `progress-bar-entities-row.js` to your `www` folder.
2. Add the resource in your Lovelace configuration:

```yaml
url: /local/progress-bar-entities-row.js
type: module
```

---

## Usage

### Inline entity row (inside an `entities` card)

```yaml
type: entities
entities:
  - type: custom:progress-bar-entities-row
    entity: sensor.battery_level
```

```yaml
type: entities
entities:
  - type: custom:progress-bar-entities-row
    entity: sensor.tank_level
    name: Tankfüllstand
    min_value: 0
    max_entity: sensor.tank_capacity
```

### Standalone card

```yaml
type: custom:progress-bar-entities-row
entity: sensor.battery_level
mode: card
min_value: 20
max_value: 80
```

---

## Options

| Option | Type | Description | Default |
|---|---|---|---|
| `entity` | entity | **Required.** Entity whose state is displayed as progress bar. | — |
| `mode` | string | Display mode: `row` (always inline), `card` (always card), `auto` (row inside entities card, card otherwise). | `auto` |
| `name` | string | Override the display name. | Entity friendly name |
| `min_value` | number | Fixed minimum value. | `0` |
| `max_value` | number | Fixed maximum value. | `100` |
| `min_entity` | entity | Entity whose state is used as minimum value. Overrides `min_value`. | — |
| `max_entity` | entity | Entity whose state is used as maximum value. Overrides `max_value`. | — |

---

## Color Thresholds

The bar color adapts to the current value relative to min/max and uses your HA theme colors:

| Range | Color |
|---|---|
| > 66 % | `--success-color` (green) |
| 33 – 66 % | `--warning-color` (orange) |
| < 33 % | `--error-color` (red) |

---

## License

MIT License – see [LICENSE](LICENSE) for details.
