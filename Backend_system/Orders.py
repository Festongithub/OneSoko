from uuid import uuid4
from datetime import datetime, timedelta
from  products import Product
from typing import List

class Order:
    def __init__(self, products:List[Product]):
        self.Order_id = uuid4()
        self.order_date = datetime.now()
        self.products = products

    def add_product(self, product: Product) -> None:
        self.products.append(product)
    
    def delete_product(self, product_id) -> bool:
        initial_length = len(self.products)
        self.products = [product for product in self.products if product.product_id != product_id]
        return len(self.products) < initial_length
    

    def get_order_id(self):
        return self.Order_id
    
    def order_date(self) -> str:
        return self.order_date.strftime("%Y-%m-%d %H:%M:%S")
    
    def total_price(self) -> float:
        return sum(product.price * product.quantity for product in self.products)
    
    def product_count(self) -> int:
        return len(self.products)
    
    def  product_details(self) -> str:
        details  = f"Order ID: {self.Order_id}\n"
        details += f"Order Date: {self.order_date}\n"
        details += f"Total Price: {self.total_price()}\n"
        details += f"Products:\n"
        for product in self.products:
            details += f"{product.product_name}: {product.price} * {product.quantity}\n"
        details += f"Product Count: {self.product_count():.2f}"
        return details
    
if __name__ == "__main__":
    shoes = Product("Shoes", 5000, 10)
    shirt = Product("Shirt", 3000, 5)

    order = Order([shoes, shirt])
    order.add_product(Product("Socks", 500, 3))
    print(order.product_details())

    order.delete_product(shoes.product_id)
    print(f'Removed a product: {shoes.product_name}')
    print(order.product_details())