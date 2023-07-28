import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Note } from 'src/app/models/note';
import { NoteDataService } from 'src/app/services/note-data.service';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss'],
})
export class NoteViewComponent implements OnInit, Note, OnChanges {
  @Input()
  id = -1;

  @Input()
  title = '';
  description = ``;

  switchToDescription(event: any) {
    event.preventDefault();
    event.target.nextElementSibling.focus();
  }

  inputTitle(event: any) {
    // let titleReload = this.title;
    // this.title = '';
    // setTimeout(() => {
    //   this.title = titleReload;
    //   this.inputData();
    // });
    this.inputData();
  }

  inputData() {
    this.noteDataService.setNoteById(this.id, {
      id: this.id,
      title: this.title.replace(/\n/g, '').replace(/\s/g, ' '),
      description: this.description,
    });
  }

  constructor(private noteDataService: NoteDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadNote();
  }

  reloadNote() {
    this.noteDataService.getNoteById(this.id).subscribe((note) => {
      if (note) {
        this.title = note.title;
        this.description = note.description;
      }
    });
  }

  ngOnInit(): void {
    this.reloadNote();
  }
}
