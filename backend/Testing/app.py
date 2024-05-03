#import streamlit as st

class budgetCategory:
    def __init__(self, description, priority, limit): #Creates an instance of the budgetCategory class
        self.description = description
        self.priority = priority
        self.limit = limit
        self.spent = 0
        self.can_notify = True
    
    def update_priority(self, new_priority): #Changes an instance's priority to the given value
        self.priority = new_priority
        return new_priority
        
    def check_limit(self): #Checks that the amount spent in a category does not exceed that category's limit
        if self.spent >= self.limit:
            self.notify("limit")
        elif self.spent >= 0.8 * self.limit:
            self.notify("warning")
        else:
            return ""
            
    def notify(self, type): #Prints a message in terminal if the limit is approached/exceeded
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
    def __init__(self, overall_budget): #Creates an instance of the budgetManager class
        self.overall_budget = overall_budget
        self.categories = []

    def generate_budget(self):
        print("Generating Budget...")
        # Logic for generating budget based on user inputs

    def add_category(self, category, priority, limit): #Creates an instance of the budgetCategory class and adds it to the budgetManager's category list
        new_category = budgetCategory(category, priority, limit)
        self.categories.append(new_category)
        return "Category " + category + " added"
        
    def get_category(self, category_name): #Takes the name of a category in the budgetManager's list and returns the corresponding budgetCategory object
        for i in self.categories:
            if i.description == category_name:
                return i

    def update_spending(self, category, amount): #Adds an amount to the spent attribute of a given class
        budget_category = self.get_category(category)
        budget_category.spent += amount
        budget_category.check_limit()
        return "Updated spending amount is: " , amount

    def disable_notification(self, category): #Disables notifications for a given class
        budget_category = self.get_category(category)
        budget_category.can_notify = False
        return "The notifications for " + category + " has been turned off"

    def enable_notification(self, category): #Enables notifications for a given class
        budget_category = self.get_category(category)
        budget_category.can_notify = True
        return "The notifications for " + category + " has been turned on"

    def make_purchase(self, amount, category):
        # Connect to bank details logic can be added here
        self.update_spending(category, amount)
        return "Purchase of £ " , amount , "made in " , category , " category."

    def display_budget_scales(self):
        print("Displaying Budget Scales...")
        # Logic to display budget scales




