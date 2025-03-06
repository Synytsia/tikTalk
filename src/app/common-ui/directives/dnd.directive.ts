import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dnd]'
})
export class DndDirective {

  @Output() fileWasDropped = new EventEmitter<File>();

  @HostBinding('class.fileOver')
  fileOver = false;

  @HostListener('dragover', ['$event'])
  OnDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  OnDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  OnDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    this.fileWasDropped.emit(event.dataTransfer?.files?.[0])
  }
}
