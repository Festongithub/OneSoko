import uuid
from uuid import uuid4
from datetime import datetime
import hashlib
from hashlib import sha256


class Customer:
    """
    Defines the Customer class 
    """
    def __init__(self, first_name, last_name, email, phone_number, created_at=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone_number = phone_number
        self.created_at = datetime.now()
        self.customer_id = uuid4()

    
    def get_customer_details(self):
        if not isinstance(self.first_name, str) or not isinstance(self.last_name, str):
            raise TypeError('First name and last name must be a string')
        else:
            return f"{self.first_name + self.last_name}"

    def create_user_email(self):
        if not isinstance(self.email, str):
            raise TypeError('Email must be a string')
        else:
            return f"{self.email}"
    
    def _hash_phone(self, phone_number):
        return hashlib.sha256(phone_number.encode()).hexdigest()

    def verify_phone(self, phone_toc_check):
        return self._hash_phone(phone_toc_check) == self.phone_number
    

    def customer_id_generator(self):
        return self.customer_id
    
    def customer_create_date(self):
        return self.created_at
    
if __name__ =="__main__":
    customer = Customer('John', 'Doe', "John@example.com", "hashedpass", "08012345678")
    print(customer.customer_id_generator())
    print(customer.customer_create_date())
    print(customer.get_customer_details())
    print(customer.create_user_email())
    print(customer.verify_phone("08012345678"))
    