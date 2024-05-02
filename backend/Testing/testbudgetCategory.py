import unittest
from app import budgetCategory

class budgetCategorytest(unittest.TestCase):   
    # ADD TEST STUFF   
    def test_update_priority(self):
        category = budgetCategory("Test", 5, 300)
        self.assertEqual(category.update_priority(3), 3)
    
    def test_check_limit(self):
        category = budgetCategory("Test", 5, 300)
        self.assertEqual(category.check_limit(), "")
        
    def test_notify(self):
        category = budgetCategory("Test", 5, 300)
        self.assertIsNone(category.notify("Test"))
    
if __name__ == '__main__':
    unittest.main()