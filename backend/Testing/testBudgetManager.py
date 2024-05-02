import unittest
from app import BudgetManager

class BudgetManagerTest(unittest.TestCase):

    def test_add_category(self):
        add = BudgetManager(1000)
        self.assertEqual(add.add_category('Groceries', 8, 200), "Category Groceries added")

    def test_update_spending(self):
        update = BudgetManager(1000)
        update.add_category('Groceries', 1, 100)  # Use the instance to call add_category
        self.assertEqual(update.update_spending('Groceries', 10), ("Updated spending amount is: ", 10))

    def test_disable_notification(self):
        disable = BudgetManager(1000)
        disable.add_category('Groceries', 1, 100)  # Use the instance to call add_category
        self.assertEqual(disable.disable_notification('Groceries'), "The notifications for Groceries has been turned off")

    def test_enable_notification(self):
        enable = BudgetManager(1000)
        enable.add_category('Groceries', 1, 100)  # Use the instance to call add_category
        self.assertEqual(enable.enable_notification('Groceries'), "The notifications for Groceries has been turned on")

    def test_make_purchase(self):
        purchase = BudgetManager(1000)
        purchase.add_category('Groceries', 1, 100)  # Use the instance to call add_category
        self.assertEqual(purchase.make_purchase(30, 'Groceries'), ("Purchase of £ ", 30, "made in ", "Groceries", " category."))

if __name__ == '__main__':
    unittest.main()
