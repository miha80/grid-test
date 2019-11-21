import { Component, OnInit, HostBinding, AfterViewInit, Input,
  HostListener, Renderer2, Output, EventEmitter } from '@angular/core';
import { GridElement } from '../models/grid-element/grid-element';
import { IDraggedData, IDroppedElemData, DropEvent, EGridEvents, IResizedElemData, IResizeStartData, ResizeEvent } from '../models/interfaces';

export enum EZones {
  DRAG = 'drag',
  RESIZE = 'resize',
}

@Component({
  selector: 'responsive-grid',
  templateUrl: './responsive-grid.component.html',
  styleUrls: ['./responsive-grid.component.scss']
})
export class ResponsiveGridComponent implements OnInit, AfterViewInit {

  private resizeStartData: IResizeStartData;

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
  }

  @HostListener('mousemove', ['$event']) mouseMoveHandler($event: MouseEvent) {
    if (this.resizeStartData) {
      const resizeEvent: ResizeEvent = this.getResizeEvent($event);
      this.elemResized.emit(resizeEvent);
    }
  }

  dragStartHandler($event: DragEvent, item: GridElement) {
    if (this.resizeStartData) {
      return false;
    }
    if (($event.target as HTMLElement).getAttribute('drag-zone')) {
      return;
    }
    const target = $event.target; // : HTMLElement
        this._renderer.setStyle(target, 'opacity', '0.005');
        $event.dataTransfer.effectAllowed = 'move';
        const data: IDraggedData = {
          id: item.id,
          realMouseX: item.left - $event.pageX,
          realMouseY: item.top - $event.pageY,
        }
        $event.dataTransfer.setData('text/plain', JSON.stringify(data));

  }

  dragOverHandler($event: DragEvent) {
      $event.preventDefault();
  }

  dragEnterHandler($event: DragEvent) {
      $event.preventDefault();
  }

  dropHandler($event: DragEvent, item: GridElement) {
    $event.preventDefault();
    $event.stopPropagation();
    this._renderer.setStyle($event.target, 'opacity', '1');

    const draggedData: IDraggedData = JSON.parse($event.dataTransfer.getData('text/plain'));
    const droppedElemData: IDroppedElemData = {
      elemId: draggedData.id,
      bounds: {
        left: $event.pageX + draggedData.realMouseX,
        top: $event.pageY + draggedData.realMouseY,
        width: item.width,
        height: item.height,
      }
    }
    this.elemDropped.emit(new DropEvent(droppedElemData));
    console.log('drop droppedElemData', droppedElemData)
  }

  dragEndHandler($event: DragEvent) {
    this._renderer.setStyle($event.target, 'opacity', '1');
  }

  mouseDownHandler($event: MouseEvent, item: GridElement, resizedElem: HTMLElement) {
    this.resizeStartData = {
      elemId: item.id,
      pageX: $event.pageX,
      pageY: $event.pageY,
      elemWidth: item.width,
      elemHeight: item.height,

      resizedElem: resizedElem,
    };
    this._renderer.setStyle(resizedElem, 'z-index', 10);
    console.log('mouseDownHandler', this.resizeStartData)
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

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('width', this.width)
  }

}
