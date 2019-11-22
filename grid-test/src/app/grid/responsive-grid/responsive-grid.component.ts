import { Component, HostBinding, Input,
  HostListener, Renderer2, Output, EventEmitter } from '@angular/core';
import { GridElement } from '../models/grid-element/grid-element';
import { IDraggedData, IDroppedElemData, DropEvent, IResizedElemData, IResizeStartData, ResizeEvent } from '../models/interfaces';

export enum EZones {
  DRAG = 'drag',
  RESIZE = 'resize',
}

@Component({
  selector: 'responsive-grid',
  templateUrl: './responsive-grid.component.html',
  styleUrls: ['./responsive-grid.component.scss']
})
export class ResponsiveGridComponent {

  private resizeStartData: IResizeStartData;
  private draggedData: IDraggedData;

  @Input() gridElements: GridElement[];

  @Output('elemDropped') elemDropped: EventEmitter<DropEvent>;
  @Output('elemResized') elemResized: EventEmitter<ResizeEvent>;

  constructor(private _renderer: Renderer2) {
    this.elemDropped = new EventEmitter();
    this.elemResized = new EventEmitter();
  }

  @HostBinding('style.width') width;

  @HostListener('mouseup', ['$event']) mouseUpHandler($event: MouseEvent) {
    if (this.resizeStartData) {
      this._renderer.setStyle(this.resizeStartData.resizedElem, 'z-index', 'auto');
      const resizeEvent: ResizeEvent = this.getResizeEvent($event);
      this.elemResized.emit(resizeEvent);
    }
    this.resizeStartData = undefined;
    this.dropHandler($event);
  }

  @HostListener('mousemove', ['$event']) mouseMoveHandler($event: MouseEvent) {
    if (this.resizeStartData) {
      const resizeEvent: ResizeEvent = this.getResizeEvent($event);
      this.elemResized.emit(resizeEvent);
    }
    this.dragOverHandler($event)
  }

  mouseDownHandler($event: MouseEvent, item: GridElement, resizedElem: HTMLElement) {
    $event.stopPropagation();
    this.resizeStartData = {
      elemId: item.id,
      pageX: $event.pageX,
      pageY: $event.pageY,
      elemWidth: item.width,
      elemHeight: item.height,
      resizedElem: resizedElem,
    };
    this._renderer.setStyle(resizedElem, 'z-index', 10);
  }

  dragStartHandler($event: MouseEvent, item: GridElement, dragElem: HTMLElement) {
    if (this.resizeStartData) {
      return false;
    }
    const data: IDraggedData = {
      id: item.id,
      realMouseX: item.left - $event.pageX,
      realMouseY: item.top - $event.pageY,
      dragElem: dragElem,
    }
    this.draggedData = data;
    this._renderer.setStyle(dragElem, 'z-index', 10);
  }

  dragOverHandler($event: MouseEvent) {
    if (this.draggedData) {
      this._renderer.setStyle(this.draggedData.dragElem, 'left', `${$event.pageX + this.draggedData.realMouseX}px`);
      this._renderer.setStyle(this.draggedData.dragElem, 'top', `${$event.pageY + this.draggedData.realMouseY}px`);
    }
  }

  dropHandler($event: MouseEvent) {
    if (this.draggedData) {
      this._renderer.setStyle(this.draggedData.dragElem, 'z-index', 'auto');
      const droppedElemData: IDroppedElemData = {
        elemId: this.draggedData.id,
        bounds: {
          left: $event.pageX + this.draggedData.realMouseX,
          top: $event.pageY + this.draggedData.realMouseY,
          width: undefined,
          height: undefined,
        }
      }
      this.elemDropped.emit(new DropEvent(droppedElemData));
    }
    this.draggedData = undefined;
  }

  getResizeEvent($event: MouseEvent): ResizeEvent {
    const resizedElemData: IResizedElemData = {
      elemId: this.resizeStartData.elemId,
      bounds: {
        left: undefined,
        top: undefined,
        width: this.resizeStartData.elemWidth + $event.pageX - this.resizeStartData.pageX,
        height: this.resizeStartData.elemHeight + $event.pageY - this.resizeStartData.pageY,
      }
    };
    return new ResizeEvent(resizedElemData);
  }

}
