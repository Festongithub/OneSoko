from datetime import datetime, timedelta
from uuid import uuid4

class Product:
    def __init__(self, product_name, price, quantity):
        self.product_name = product_name
        self.price = price  # Assuming price can be float or int
        self.quantity = quantity
        self.updated_at = datetime.now() - timedelta(days=1)  # Yesterday
        self.purchase_date = datetime.now()  # Now
        self.product_id = uuid4()

    def update_product(self, product_name, price, quantity):
        self.product_name = product_name
        self.price = price
        self.quantity = quantity
        self.updated_at = datetime.now()

    def get_product_name(self):
        if self.product_name:  # Returns None if empty, which is fine
            return self.product_name

    def get_product_price(self):
        if not isinstance(self.price, (int, float)):  # Allow both int and float
            raise ValueError("Price must be a number")
        return f"{self.product_name}: {self.price}"

    def get_product_quantity(self):
        if not isinstance(self.quantity, int):
            raise ValueError("Quantity must be an integer")
        return f"{self.product_name}: {self.quantity}"

    def get_product_id(self):
        return self.product_id

    def get_purchase_date(self):  # Renamed for clarity
        return self.purchase_date.strftime("%Y-%m-%d %H:%M:%S")

    def get_updated_at(self):  # Renamed and simplified
        return self.updated_at.strftime("%Y-%m-%d %H:%M:%S")

if __name__ == "__main__":
    product = Product("Shoes", 5000, 10)
    print(product.get_product_name())      # 'Shoes'
    print(product.get_product_price())     # 'Shoes: 5000'
    print(product.get_product_quantity())  # 'Shoes: 10'
    print(product.get_product_id())        # UUID, e.g., '123e4567-e89b-12d3-a456-426614174000'
    print(product.get_purchase_date())     # e.g., '2025-02-21 15:30:45'
    print(product.get_updated_at())        # e.g., '2025-02-20 15:30:45'