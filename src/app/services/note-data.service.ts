import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoteDataService {
  private _noteList: Note[] = [
    {
      id: 1,
      title: 'Заметка 1',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore quibusdam ut iure vel qui corrupti odit! Deleniti,',
    },
    {
      id: 2,
      title: 'Заметка 2',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore quibusdam ut iure vel qui corrupti odit! Deleniti,',
    },
    {
      id: 3,
      title: 'Как работают заметки',
      description:
        `Вы можете удалять, добавлять, редактировать заметки.<br>
        Данные хранятся в памяти устройства (localstorage).
        <br><br>
        Описание хранится в формате HTML, соответственно вы можете добавлять картинки или, например, <b>жирный текст</b>.
        <br>
        Каждая заметка имеет уникальную ссылку. Если перейти по ссылке на несуществующую заметку, можно создать новую с этой ссылкой.
        `,
    },
  ];
  changeSubject = new Subject<void>();

  // Позволяет при присваивании сохранять в localStorage
  private set noteList(value: Note[]) {
    this._noteList = value;
    localStorage.setItem('noteList', JSON.stringify(this._noteList));
    this.changeSubject.next();
  }

  // выводит только имена заметок
  getNotes(): Observable<Partial<Note>[]> {
    return of(
      this._noteList.map((note) => ({
        id: note.id,
        title: note.title,
      }))
    ).pipe(take(1));
  }

  getNoteById(id: number): Observable<Note> {
    this.removeEmptyNotes(id);
    return of(this._noteList.find((note) => note.id === id)!).pipe(take(1));
  }

  setNoteById(id: number, note: Note) {
    if (!this._noteList.find((note) => note.id === id)) {
      this.noteList = [...this._noteList, note];
    }
    this.noteList = this._noteList.map((n) => (n.id === id ? note : n));
    this.changeSubject.next();
  }

  deleteNoteById(id: number) {
    this.noteList = this._noteList.filter((n) => n.id !== id);
  }

  addNote(note?: Partial<Note>): number {
    this.removeEmptyNotes();
    let id = 1;
    if (this._noteList.length)
      id = this._noteList[this._noteList.length - 1].id + 1;
    id = note.id ?? id;
    this.noteList = [
      ...this._noteList,
      {
        id: id,
        title: note.title ?? '',
        description: note.description ?? '',
      },
    ];
    return id;
  }

  removeEmptyNotes(idToKeep?: number) {
    let newNoteList = this._noteList.filter(
      (note) => note.id == idToKeep || note.title || note.description
    );
    if (newNoteList != this._noteList) {
      this.noteList = newNoteList;
    }
  }

  constructor() {
    if (localStorage.getItem('noteList')) {
      this._noteList = JSON.parse(localStorage.getItem('noteList'));
    }
  }
}
