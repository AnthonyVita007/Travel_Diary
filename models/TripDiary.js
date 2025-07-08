import DiaryNote from './DiaryNote';

export default class TripDiary {
  constructor(id, tripId) {
    this.id = id;
    this.tripId = tripId;
    this.notes = [];
    this.nextNoteId = 1;
  }

  // Aggiunge una nuova nota al diario
  addNote(note) {
    if (!(note instanceof DiaryNote)) {
      throw new Error('L\'oggetto deve essere un\'istanza di DiaryNote');
    }
    this.notes.push(note);
    return note;
  }

  // Crea una nuova nota con i dati forniti
  createNote(title, date, content, images = []) {
    const note = new DiaryNote(
      this.nextNoteId++,
      this.id,
      title,
      date,
      content,
      images
    );
    this.addNote(note);
    return note;
  }

  // Rimuove una nota dal diario
  removeNote(noteId) {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== noteId);
    return initialLength !== this.notes.length; // Restituisce true se la nota è stata rimossa
  }

  // Aggiorna una nota esistente
  updateNote(updatedNote) {
    const index = this.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      this.notes[index] = updatedNote;
      return true;
    }
    return false;
  }

  // Ottiene tutte le note
  getNotes() {
    return [...this.notes];
  }

  // Ottiene una nota specifica per ID
  getNote(noteId) {
    return this.notes.find(note => note.id === noteId);
  }
}