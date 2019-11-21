import { IBounds } from '../interfaces';

export class GridElement implements IBounds {

  public readonly id: number;

  constructor(public left: number,
              public top: number,
              public width: number,
              public height: number,
              public index: number,) {

    this.id = index;
  }

  isAbove(rect: GridElement): boolean {
    return this.top > rect.top + rect.height;
  }

  isLeftHand(rect: GridElement): boolean {
    return this.left + this.width < rect.left;
  }

  overlaps(rect: GridElement): boolean {
    return !(
              this.isAbove(rect) || rect.isAbove(this)
              || this.isLeftHand(rect) || rect.isLeftHand(this)
            );
  }

  setLeftTop(left: number, top: number, responsiveGridWidth: number, margin: number, gridStep: number) {
    left = Math.min(left, responsiveGridWidth - margin - this.width);
    left = Math.max(margin, left);
    this.left = Math.round((left - margin) / gridStep) * gridStep + margin;
    top = Math.max(margin, top);
    this.top = Math.round((top - margin) / gridStep) * gridStep + margin;
  }

  setWidthHeight(width: number, height: number, responsiveGridWidth: number, margin: number, gridStep: number) {
    width = Math.round(width / gridStep) * gridStep;
    width = Math.min(width, responsiveGridWidth - margin - this.left);
    this.width = width;

    this.height = Math.round(height / gridStep) * gridStep;
  }

  startsBetweenLeftRight(rect: GridElement): boolean {
    return this.left >= rect.left && this.left <= rect.left + rect.width;
  }

}
