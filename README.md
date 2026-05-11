# Progress Bar Entity Row for Home Assistant

**⚠️ Not ready: You should not use this component yet.**

A customizable card or entity row to display a progress bar, supporting dynamic min/max values via entity or config.

## ✅ Features

- [x] Works in both `card` and `entity-row` mode. Inline usage in entities card.
- [x] Dynamic maximum from another entity
- [x] Configurable fixed min/max
- [ ] Label in percent or absolute
- [ ] Fix CSS
- [ ] Custom colors

## ⚙️ Installation

1. Add this repo as a custom repository in HACS:
   - URL: `https://github.com/eboreg99/battery-bar-card`
   - Type: Lovelace

2. Install the card via HACS.
3. Add the resource manually if needed:
   ```yaml
   url: /hacsfiles/battery-bar-card/battery-bar-card.js
   type: module
   ```

## ⚙️ Example Usage

Dynamic min/max entity row:
```yaml
type: custom:battery-bar-card
entity: sensor.battery_level
mode: row
min_entity: sensor.batttery_min
max_entity: sensor.battery_max
```
Static min/max card:
```yaml
type: custom:battery-bar-card
entity: sensor.battery_level
mode: auto
min_value: 20
max_value: 80
```

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `entity` | entity | Entity to display | |
| `mode` | string | Display style. `row` for inline entity row (for card *entities*). / `auto` for card style. | `auto` |
| `min_value` | number | Fixed minimum value. | 0 |
| `max_value` | number | Fixed maximum value. | 100 |
| `min_entity` | entity | Value of entity as minimum value for the bar. |  |
| `max_entity` | entity | Value of entity as maximum value for the bar. |  |


## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
