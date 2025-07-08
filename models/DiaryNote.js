export default class DiaryNote {
  constructor(id, diaryId, title, date, content, images = []) {
    this.id = id;
    this.diaryId = diaryId;
    this.title = title;
    this.date = date;        // Data di riferimento della nota
    this.content = content;  // Contenuto testuale
    this.images = images;    // Array di URI delle immagini
  }
}