class Product {
  constructor(name, description, quantity, price, category, location, availableFrom, farmerId) {
    this.name = name;
    this.description = description;
    this.quantity = parseInt(quantity);
    this.price = parseFloat(price);
    this.category = category;
    this.location = location;
    this.availableFrom = availableFrom; 
    this.farmerId = farmerId; 
    this.createdAt = new Date();
  }
}

module.exports = Product;
