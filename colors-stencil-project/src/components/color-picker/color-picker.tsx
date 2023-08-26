import { Component, EventEmitter, Event, h } from '@stencil/core';

@Component({
  tag: 'color-picker',
  styleUrl: 'color-picker.scss',
  shadow: true,
})
export class ColorPicker {
  @Event() colorChange: EventEmitter<string>;

  handleChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.colorChange.emit(color);
  }
  render() {
    return (
      <div>
        {' '}
        <input type="color" onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}
