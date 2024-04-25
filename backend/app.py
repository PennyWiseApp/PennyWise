#import streamlit as st

class budgetCategory:
    def __init__(self, description, priority, limit):
        self.description = description
        self.priority = priority
        self.limit = limit
        self.spent = 0
        self.can_notify = True
    
    def update_priority(self, new_priority):
        self.priority = new_priority
        return new_priority
        
    def check_limit(self):
        if self.spent >= self.limit:
            self.notify("limit")
        elif self.spent >= 0.8 * self.limit:
            self.notify("warning")
        else:
            return ""
            
    def notify(self, type):
        if self.can_notify:
            if type == "limit":
                print("ALERT: Spending limit reached or exceeded for " + self.description)
            elif type == "warning":
                print("WARNING: You are approaching the limit for " + self.description)
            else:
                return None
        else:
            return None
            

class BudgetManager:
    def __init__(self, overall_budget):
        self.overall_budget = overall_budget
        self.categories = []

    def generate_budget(self):
        print("Generating Budget...")
        # Logic for generating budget based on user inputs

    def add_category(self, category, priority, limit):
        new_category = budgetCategory(category, priority, limit)
        self.categories.append(new_category)
        
    def get_category(self, category_name):
        for i in self.categories:
            if i.description == category_name:
                return i

    def update_spending(self, category, amount):
        budget_category = self.get_category(category)
        budget_category.spent += amount
        budget_category.check_limit()

    def disable_notification(self, category):
        budget_category = self.get_category(category)
        budget_category.can_notify = False

    def enable_notification(self, category):
        budget_category = self.get_category(category)
        budget_category.can_notify = True

    def make_purchase(self, amount, category):
        # Connect to bank details logic can be added here
        self.update_spending(category, amount)
        print(f"Purchase of £{amount} made in {category} category.")

    def display_budget_scales(self):
        print("Displaying Budget Scales...")
        # Logic to display budget scales


# Example uses:
budget_manager = BudgetManager(1000)  # Set overall budget to 1000

budget_manager.generate_budget()

budget_manager.add_category('Groceries', 8, 200)
budget_manager.add_category('Entertainment', 4, 100)

budget_manager.make_purchase(50, 'Groceries')
budget_manager.make_purchase(30, 'Entertainment')

budget_manager.disable_notification('Entertainment')

budget_manager.make_purchase(80, 'Entertainment')

print(budget_manager.categories)

