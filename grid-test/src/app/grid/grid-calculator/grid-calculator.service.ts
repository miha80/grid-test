import { Injectable } from '@angular/core';
import { GridElement } from '../models/grid-element/grid-element';
import { IBounds, IDroppedElemData } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GridCalculatorService {

  constructor() { }

  getInitialTestElems(gutter: number,
                      margin: number,
                      responsiveGridWidth: number): GridElement[] {
    const rows = 3;
    const columns = 10;
    const vertTailNum = 5;
    const horTailNum = Math.floor((responsiveGridWidth - 2 * margin - (columns - 1) * gutter) / (columns * gutter));
    const initElemWidth = horTailNum * gutter;
    const initElemHeight = vertTailNum * gutter;
    let result: GridElement[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const nextElem: GridElement = new GridElement(
          margin + j * (initElemWidth + gutter),
          margin + i * (initElemHeight + gutter),
          initElemWidth,
          initElemHeight,
          columns * i + j,
        );
        result.push(nextElem);

      }
    }
    return result;
  }

  private getDependentElemsBelow(currentElem: GridElement, movedElem: GridElement, allElems: GridElement[]): GridElement[] {

    let dependentElems: GridElement[] = [];
    // let currentElem: GridElement = allElems[rectIndex];
    allElems.forEach((nextElem: GridElement) => {
      if (nextElem.isAbove(currentElem) && this.isXIntersection(nextElem, currentElem) && nextElem.id !== movedElem.id) {
        dependentElems.push(nextElem);
        const nextDependentElems: GridElement[] = this.getDependentElemsBelow(nextElem, movedElem, allElems);
        dependentElems = [...dependentElems, ...nextDependentElems];
      }
    })
    return dependentElems;
  }

  private isXIntersection(rect1: GridElement, rect2: GridElement): boolean {
    return rect1.startsBetweenLeftRight(rect2) || rect2.startsBetweenLeftRight(rect1);
  }

  removeRepeatedElems(elems: GridElement[]): GridElement[] {
    const idSet: Set<number> = new Set();
    const result: GridElement[] = [];
    elems.forEach((nextElem: GridElement) => {
      if (!idSet.has(nextElem.id)) {
        idSet.add(nextElem.id);
        result.push(nextElem);
      }
    });
    return result;
  }

  moveElemDown( elem: GridElement,
                allElems: GridElement[],
                gutter: number,
                responsiveGridWidth: number,
                margin: number,
                gridStep: number): GridElement {
    const topDiffs: number[] = allElems.filter((nextElem: GridElement) => {
                                          const condition = elem.isAbove(nextElem) && this.isXIntersection(nextElem, elem);
                                          return condition;
                                        })
                                        .map((nextElem: GridElement) => {
                                          return (nextElem.top + nextElem.height + gutter) - elem.top;
                                        })
    let topDiff: number = topDiffs.length > 0 ? Math.max(...topDiffs) : 0;
    elem.setLeftTop(elem.left, elem.top + topDiff, responsiveGridWidth, margin, gridStep);
    return elem;
  }

  private sortByLeftTop(a: GridElement, b: GridElement): number {
    return (a.top - b.top) || (a.left - b.left);
  }

  private moveOverlapedElemsUp(movedElem: GridElement,
                                elems: GridElement[],
                                gutter: number,
                                responsiveGridWidth: number,
                                margin: number,
                                gridStep: number): GridElement[] {
    const overlapedElems: GridElement[] = elems.filter((nextElem: GridElement) => {
      return movedElem.overlaps(nextElem) && nextElem.id !== movedElem.id;
    });

    const dependentElems: GridElement[] = overlapedElems.map((nextElem: GridElement) => {
      return this.getDependentElemsBelow(nextElem, movedElem, elems);
    }).reduce((prevArr: GridElement[], nextArr: GridElement[]) => {
      return [...prevArr, ...nextArr];
    }, []);

    const allElemsNeeded: GridElement[] = this.removeRepeatedElems([...overlapedElems, ...dependentElems]);
    const tops: number[] = overlapedElems.map((nextElem: GridElement) => nextElem.top);
    const minTop: number = Math.min(...tops);
    if (minTop >= 0) {
      const topDiff: number = movedElem.top + movedElem.height + gutter - minTop;
      allElemsNeeded.forEach((nextElem: GridElement) => {
        return nextElem.setLeftTop(nextElem.left, nextElem.top + topDiff, responsiveGridWidth, margin, gridStep);
      });
    }
    return allElemsNeeded;
  }

  findElemIndexById(elemId: number, allElems: GridElement[]): number {
    let result: number;
     allElems.find((nextElem:GridElement, index: number) => {
      const condition: boolean = nextElem.id === elemId;
      if (condition) {
        result = index;
      }
      return condition;
    });
    return result;
  }

  public recalculatePositionAfterDrop(droppedElemData: IDroppedElemData,
                                      allElems: GridElement[],
                                      gutter: number,
                                      responsiveGridWidth: number,
                                      margin: number,
                                      gridStep: number): GridElement[] {

    let droppedElem: GridElement;
    const restElems: GridElement[] = allElems.filter((nextElem: GridElement) => {
      const condition: boolean = nextElem.id === droppedElemData.elemId;
      if (condition) {
        droppedElem = nextElem;
      }
      return !condition;
    });
    droppedElem.setLeftTop(droppedElemData.bounds.left, droppedElemData.bounds.top, responsiveGridWidth, margin, gridStep);
    restElems.forEach((nextElem: GridElement) => {
      return this.moveElemDown(nextElem, restElems, gutter, responsiveGridWidth, margin, gridStep);
    });
    this.moveOverlapedElemsUp(droppedElem, allElems, gutter, responsiveGridWidth, margin, gridStep);
    allElems.sort(this.sortByLeftTop);
    allElems.forEach((nextElem: GridElement) => this.moveElemDown(nextElem, allElems, gutter, responsiveGridWidth, margin, gridStep));
    return allElems;
  }
}
