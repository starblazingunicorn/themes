import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true,
})
export class AppHome {
  @State() selectedColor: string = '#000000';

  @State() contrastRatio: number = 0;

  private color1: string = '#000000';
  private color2: string = '#ffffff';

  calculateContrastRatio(color1: string, color2: string): number {
    const parsedColor1 = this.parseColor(color1);
    const parsedColor2 = this.parseColor(color2);

    const l1 = this.calculateRelativeLuminance(parsedColor1);
    const l2 = this.calculateRelativeLuminance(parsedColor2);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (brighter + 0.05) / (darker + 0.05);
  }

  parseColor(color: string): { r: number; g: number; b: number } {
    const hex = color.replace(/^#/, '');
    const bigint = parseInt(hex, 16);

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  calculateRelativeLuminance(color: { r: number; g: number; b: number }): number {
    const sRGB = (value: number) => {
      value /= 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const r = sRGB(color.r);
    const g = sRGB(color.g);
    const b = sRGB(color.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  updateColor(colorType: 'color1' | 'color2', event: Event) {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this[colorType] = color;
    this.contrastRatio = this.calculateContrastRatio(this.color1, this.color2);
  }

  // handleColorChange(event: CustomEvent<string>) {
  //   this.selectedColor = event.detail;
  // }
  // Add a method to check if a given contrast ratio meets a certain level
  meetsContrastLevel(contrastRatio: number, level: 'AA' | 'AAA', size: 'normal' | 'large'): boolean {
    const requiredContrast = level === 'AA' ? (size === 'large' ? 3 : 4.5) : (size === 'large' ? 4.5 : 7);
    return contrastRatio >= requiredContrast;
  }
  render() {
    const aaNormal = this.meetsContrastLevel(this.contrastRatio, 'AA', 'normal');
    const aaLarge = this.meetsContrastLevel(this.contrastRatio, 'AA', 'large');
    const aaaNormal = this.meetsContrastLevel(this.contrastRatio, 'AAA', 'normal');
    const aaaLarge = this.meetsContrastLevel(this.contrastRatio, 'AAA', 'large');

    return (
      <div class="app-home">
        <label htmlFor="color1">Color 1:</label>
        <input id="color1" type="color" value={this.color1} onInput={event => this.updateColor('color1', event)} />
        <br />
        <br />
        <label htmlFor="color2">Color 2:</label>
        <input id="color2" type="color" value={this.color2} onInput={event => this.updateColor('color2', event)} />
        <br />
        <br />

        {/* <div class="contrast-ratio">Contrast Ratio: {this.contrastRatio.toFixed(2)}</div> */}
        <div class="contrast-ratio">
          Contrast Ratio: {this.calculateContrastRatio(this.color1, this.color2).toFixed(2)}
        </div>
        <div class="results">
          <div class="result">AA Normal: {aaNormal ? 'Pass' : 'Fail'}</div>
          <div class="result">AA Large: {aaLarge ? 'Pass' : 'Fail'}</div>
          <div class="result">AAA Normal: {aaaNormal ? 'Pass' : 'Fail'}</div>
          <div class="result">AAA Large: {aaaLarge ? 'Pass' : 'Fail'}</div>
        </div>
        {/* <stencil-route-link url="/profile/stencil">
          <button>Profile page</button>
        </stencil-route-link> */}

        {/* <color-picker onColorChange={this.handleColorChange.bind(this)}></color-picker>
        <div class="ui-element" style={{ backgroundColor: this.selectedColor }}>
          This is a UI element that can change color!
        </div> */}
      </div>
    );
  }
}
