import { GridElement } from './grid-element/grid-element';

export interface IBounds {
  //id: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IDraggedData {
  id: number;
  realMouseX: number;
  realMouseY: number;
}

export interface IDroppedElemData {
  elemId: number;
  bounds: IBounds;
}

export enum EGridEvents {
  INIT = 'INIT',
  DROP = 'DROP',
  RESIZE = 'RESIZE',
}

export interface IEvent<T> {
  type: EGridEvents;
  payload: T;
}

export class DropEvent implements IEvent<IDroppedElemData> {
  public readonly type = EGridEvents.DROP;

  constructor(public payload: IDroppedElemData) { }
}

export interface IResizedElemData {
  elemId: number;
  bounds: IBounds;
}

export class ResizeEvent implements IEvent<IResizedElemData> {
  public readonly type = EGridEvents.RESIZE;

  constructor(public payload: IResizedElemData) { }
}

export class InitEvent implements IEvent<GridElement[]> {
  public readonly type = EGridEvents.INIT;

  constructor(public payload: GridElement[]) { }
}

export type GridEvent = InitEvent | DropEvent | ResizeEvent;

export interface IResizeStartData {
  elemId: number;
  pageX: number;
  pageY: number;
  elemWidth: number;
  elemHeight: number;
  resizedElem: HTMLElement;
}
