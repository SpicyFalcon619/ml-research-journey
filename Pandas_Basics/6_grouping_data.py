"""
Pandas Reference: Grouping and aggregating data
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The split-apply-combine idea behind groupby
#   - Grouping by a category and summarising a column (mean, max, count)
#   - Several summaries at once with agg()
#   - Turning the result back into a normal table with reset_index()
# =============================================================================

import pandas as pd

# A dataset of employees across different departments
employee_data = pd.DataFrame(
    {
        "Name": ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona"],
        "Department": ["Engineering", "Sales", "Engineering", "HR", "Sales", "Engineering"],
        "Salary": [85000, 60000, 95000, 70000, 75000, 110000],
        "Experience_Years": [3, 1, 5, 2, 4, 8],
    }
)

print("--- All Employees ---")
print(employee_data)
print("\n")


### Topic 1: The idea ###
# Question: "What is the average salary in each department?"
# You could filter one department at a time, but groupby does it in one go by
# SPLIT-APPLY-COMBINE:
#
#   1. SPLIT   cut the table into pieces, one per department
#   2. APPLY   compute something (here: the mean salary) on each piece
#   3. COMBINE put the answers back together in one result
#
# You can group by a category and then calculate statistics for each group!
# Pattern:  table.groupby("CategoryColumn")["NumberColumn"].mean()


### Topic 2: groupby + a summary ###
avg_salary_by_dept = employee_data.groupby("Department")["Salary"].mean()
print(avg_salary_by_dept)
# The result is a Series whose index is the department names.

print()

# Swap the summary function: max() finds the most experienced person's years.
max_exp_by_dept = employee_data.groupby("Department")["Experience_Years"].max()
print(max_exp_by_dept)

print()

# Others: sum(), min(), median(), count() (how many non-missing), size() (rows).
print(employee_data.groupby("Department")["Salary"].sum())
print(employee_data.groupby("Department").size())  # headcount per department


### Topic 3: Several summaries at once ###
# agg takes a list of function names and gives one column per summary.
print(employee_data.groupby("Department")["Salary"].agg(["mean", "min", "max"]))

# Or different summaries for different columns, using a dictionary:
print(employee_data.groupby("Department").agg({"Salary": "mean", "Experience_Years": "max"}))


### Topic 4: Back to a normal table ###
# The group names became the INDEX. reset_index() turns them back into an
# ordinary column, which is easier to work with or save:
summary = employee_data.groupby("Department")["Salary"].mean().reset_index()
print(summary)

# And you can sort it like any table (smallest average first here):
print(summary.sort_values("Salary"))


### Topic 5: Grouping by more than one column ###
employee_data["Senior"] = employee_data["Experience_Years"] >= 4
print(employee_data.groupby(["Department", "Senior"])["Salary"].mean())


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Group employee_data by Department and calculate the mean Salary. Store it
#      in avg_salary_by_dept and print it.
#   2. Group by Department again, but find the max Experience_Years, to see the
#      most senior person's years in each department.
#   3. Find the total Salary spent on each department.
#   4. Which department has the highest average experience? (Hint: group, take
#      the mean, then use .idxmax().)
# =============================================================================
