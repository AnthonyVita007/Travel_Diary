export default class Trip {
  constructor(id, title, imageUri, departureDate, returnDate, Location, description, category, favorite) {
    this.id = id;
    this.title = title;
    this.imageUri = imageUri;
    this.departureDate = departureDate;
    this.returnDate = returnDate;
    this.Location = Location;
    this.description = description;
    this.category = category;
    this.favorite = favorite;
  }

  toggleFavorite() {
    this.favorite = !this.favorite;
  }
}