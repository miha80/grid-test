import { Component, OnInit, HostBinding, AfterViewInit, Input,
  HostListener, Renderer2, Output, EventEmitter } from '@angular/core';
import { GridElement } from '../models/grid-element/grid-element';
import { IDraggedData, IDroppedElemData, DropEvent, EGridEvents } from '../models/interfaces';

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

  @Input() gridElements: GridElement[];

  @Output('elemDropped') elemDropped: EventEmitter<DropEvent>;

  constructor(private _renderer: Renderer2) {
    this.elemDropped = new EventEmitter();
  }

  @HostBinding('style.width') width;




  dragStartHandler($event: DragEvent, item: GridElement) {
    if (($event.target as HTMLElement).getAttribute('drag-zone')) {
      return;
    }
    const target = $event.target; // : HTMLElement
    //DragEventListenerDirective.dragSrcEl = this.currentCell;
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
/*
@HostListener('dragover', ['$event'])

@HostListener('dragenter', ['$event'])

@HostListener('drop', ['$event']) dropHandler($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.renderer.setStyle(DragEventListenerDirective.dragSrcEl, 'opacity', '1');
    const dragElIsGridCell: boolean = this.isGridCell(DragEventListenerDirective.dragSrcEl);
    if (this.isGrid || dragElIsGridCell) {
        this.clearInnerHtml();
        const viewportColor: WmColor = <WmColor>$event.dataTransfer.getData('text/plain');
        const gridPayload: IGridStatePayload = {'isGrid': this.isGrid,
                                                'viewportColor': viewportColor,
                                                'targetRowColumnData': this.rowColumnData} as IGridStatePayload;
        this.wndStateActionsService.changeGridState(gridPayload);
    }

}

@HostListener('dragend', ['$event']) dragEndHandler($event: DragEvent) {
    this.renderer.setStyle(DragEventListenerDirective.dragSrcEl, 'opacity', '1');
}
*/






  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('width', this.width)
  }

}
