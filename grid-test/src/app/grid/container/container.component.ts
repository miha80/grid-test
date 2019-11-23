import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GridElement } from '../models/grid-element/grid-element';
import { GridCalculatorService } from '../grid-calculator/grid-calculator.service';
import { IDroppedElemData, DropEvent, GridEvent, EGridEvents, InitEvent, ResizeEvent } from '../models/interfaces';
import { Subject, Observable, Subscription, animationFrameScheduler } from 'rxjs';
import { map, observeOn } from 'rxjs/operators';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  public readonly gridStep: number = 20;
  public readonly gutter: number = 20;
  public readonly margin: number = 20;
  public readonly minSize: number = 100;
  public gridElements: GridElement[];
  public gridEventsSubscription: Subscription;

  private eventSubj: Subject<GridEvent>;

  @ViewChild('responsiveGridContainer', { static: true }) responsiveGridContainer: ElementRef;

  constructor(private _grid_calculator_service: GridCalculatorService) {
    this.eventSubj = new Subject();
  }

  getResponsiveGridWidth(): number {
    return (this.responsiveGridContainer.nativeElement as HTMLElement).getBoundingClientRect().width;
  }

  droppedElemHandler($event: DropEvent) {
    this.eventSubj.next($event);
  }

  elemResizedEventHandler($event: ResizeEvent) {
this.eventSubj.next($event);
  }

  ngOnInit() {
    this.gridElements = this._grid_calculator_service.getInitialTestElems(this.gutter,this.margin, this.getResponsiveGridWidth());
    this.gridEventsSubscription = this.eventSubj.pipe(
      map((event: GridEvent) => {
        let result: GridElement[] = [];
        switch (event.type) {
          case EGridEvents.INIT: {
            result = event.payload;
          } break;

          case EGridEvents.DROP: {
            result = this._grid_calculator_service.recalculatePositionAfterDrop(
                                                      event.payload,
                                                      this.gridElements,
                                                      this.gutter,
                                                      this.getResponsiveGridWidth(),
                                                      this.margin,
                                                      this.gridStep
                                                    );
          } break;

          case EGridEvents.RESIZE: {
            result = this._grid_calculator_service.recalculatePositionsAfterResize(
                                                      event.payload,
                                                      this.gridElements,
                                                      this.gutter,
                                                      this.getResponsiveGridWidth(),
                                                      this.margin,
                                                      this.gridStep,
                                                      this.minSize,
                                                    );
          } break;
        }
        return result;
      }),
      observeOn(animationFrameScheduler),
    ).subscribe((gridElems: GridElement[]) => {
        this.gridElements = [...gridElems]
    });




  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.gridEventsSubscription.unsubscribe();
  }
}
