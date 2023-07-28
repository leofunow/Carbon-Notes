import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NoteDataService } from 'src/app/services/note-data.service';
import { switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Note } from 'src/app/models/note';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterContentChecked {
  notes: Partial<Note>[] = [];
  _curNoteId = -1;

  idToDelete = -1;

  constructor(
    private noteDataService: NoteDataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {}
  ngAfterContentChecked(): void {
    this.cdref.detectChanges()
  }

  get curNoteId(): number {
    return this._curNoteId;
  }

  set curNoteId(value: number) {
    this.router.navigate(['../', value != -1 ? value : ''], { relativeTo: this.route });
    this._curNoteId = value;
  }

  reloadNotes() {
    this.noteDataService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

  selectNote(id: number) {
    this.curNoteId = id;
  }

  addNote() {
    
    this.curNoteId = this.noteDataService.addNote({});
  }

  deleteNote(id: number, event?: any) {
    if (event) event.stopImmediatePropagation();
    this.idToDelete = id;
    if (this.curNoteId === id) this.curNoteId = -1;
    setTimeout(() => {
      this.noteDataService.deleteNoteById(id);
      this.idToDelete = -1;
    }, 200);
  }

  getNoteClass(id: number) {
    return {
      'aside-note': true,
      active: this.curNoteId === id,
      delete: this.idToDelete === id,
    };
  }

  ngOnInit(): void {
    this.reloadNotes();
    this.route.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((data) => {
        this._curNoteId = +data;
      });

    this.noteDataService.changeSubject.subscribe(() => {
      this.reloadNotes();
    });
  }
}
