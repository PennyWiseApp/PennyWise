import unittest
from app import budgetCategory

class budgetCategorytest(unittest.TestCase):
       
    def update_priority(self, new_priority):
        self.priority = new_priority
        
    def check_limit(self):
        if self.spent >= self.limit:
            self.notify("limit")
        elif self.spent >= 0.8 * self.limit:
            self.notify("warning")
            
    def notify(self, type):
        if self.can_notify:
            if type == "limit":
                print("ALERT: Spending limit reached or exceeded for " + self.description)
            elif type == "warning":
                print("WARNING: You are approaching the limit for " + self.description)