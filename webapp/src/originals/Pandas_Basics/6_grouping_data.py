"""
Pandas Reference: Grouping and aggregating data
"""
from pandas.core.groupby import GroupBy
import pandas as pd

# A dataset of employees across different departments
employee_data = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona"],
    "Department": ["Engineering", "Sales", "Engineering", "HR", "Sales", "Engineering"],
    "Salary": [85000, 60000, 95000, 70000, 75000, 110000],
    "Experience_Years": [3, 1, 5, 2, 4, 8]
})

print("--- All Employees ---")
print(employee_data)
print("\n")

### Topic: Grouping and Aggregating ###
# You can group data by a category, and then calculate statistics for each group!
# Example: dataset.groupby('CategoryColumn')['NumberColumn'].mean()

# 1. Group the 'employee_data' by 'Department', and calculate the mean() 'Salary'.
#    Variable: 'avg_salary_by_dept'
# 2. Print 'avg_salary_by_dept'.

# 3. Group the 'employee_data' by 'Department' again, but this time calculate 
#    the max() 'Experience_Years' to find the most senior person in each department!
#    Variable: 'max_exp_by_dept'
# 4. Print 'max_exp_by_dept'.

avg_salary_by_dept = employee_data.groupby('Department')['Salary'].mean()
print(avg_salary_by_dept)

print()

max_exp_by_dept = employee_data.groupby('Department')['Experience_Years'].max()
print(max_exp_by_dept)