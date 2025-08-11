class Order {
  constructor(productId, buyerId, quantity, unitPrice, status = "pending", ) {
   
    const allowedStatus = ["pending", "paid", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(status.toLowerCase())) {
      throw new Error(`Invalid status: ${status}. Allowed: ${allowedStatus.join(", ")}`);
    }

    this.productId = productId;        
    this.buyerId = buyerId;          
    this.quantity = parseInt(quantity);
    this.totalPrice = unitPrice ? parseFloat(unitPrice) * this.quantity : null;
    this.status = status.toLowerCase(); 
    this.createdAt = new Date();
    
  }

}

module.exports = Order;
