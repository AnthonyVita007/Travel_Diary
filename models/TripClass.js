export default class Trip {
  constructor(id, title, image, departureDate, returnDate, category, favorite) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.departureDate = departureDate;
    this.returnDate = returnDate;
    this.category = category;
    this.favorite = favorite;
  }

  toggleFavorite() {
    this.favorite = !this.favorite;
  }
}