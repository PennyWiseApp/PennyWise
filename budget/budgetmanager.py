# import matplotlib.pyplot as plt


class BudgetManager:
    def __init__(self, overall_budget):
        self.overall_budget = overall_budget
        self.categories = {}
        self.notifications = {}

    def generate_budget(self):
        print("Generating Budget...")
        # Logic for generating budget based on user inputs

    def add_category_limit(self, category, limit):
        self.categories[category] = {'limit': limit, 'spent': 0}

    def update_spending(self, category, amount):
        if category in self.categories:
            self.categories[category]['spent'] += amount
            self.check_category_limit(category)

    def check_category_limit(self, category):
        if category in self.categories:
            limit = self.categories[category]['limit']
            spent = self.categories[category]['spent']
            if spent >= limit:
                self.notify_alert(category)
            elif spent >= 0.8 * limit:
                self.notify_warning(category)

    def notify_alert(self, category):
        print(f"ALERT: You have reached the spending limit for {category}!")

    def notify_warning(self, category):
        print(f"WARNING: You are close to reaching the spending limit for {category}.")

    def disable_notification(self, category):
        if category in self.notifications:
            self.notifications[category] = False

    def enable_notification(self, category):
        if category in self.notifications:
            self.notifications[category] = True

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

budget_manager.add_category_limit('Groceries', 200)
budget_manager.add_category_limit('Entertainment', 100)

budget_manager.make_purchase(50, 'Groceries')
budget_manager.make_purchase(30, 'Entertainment')

budget_manager.disable_notification('Entertainment')

budget_manager.make_purchase(80, 'Entertainment')
















