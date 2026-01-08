# def generate_analytics(data):
#     categories = {
#         "Opening": {
#             "type": "",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Mandatory/Utility": {
#             "type": "mandatory",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Investment/Savings": {
#             "type": "mandatory",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Non-Mandatory (Food/Grocery/Households)": {
#             "type": "non-mandatory",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Luxury/Discretionary": {
#             "type": "non-mandatory",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Adjustment": {
#             "type": "",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#         "Travel": {
#             "type": "non-mandatory",
#             "count": 0,
#             "withdraw": 0,
#             "deposit": 0
#         },
#     }
    
#     results = []
    
#     for row in data["data"]:
#         withdrawal = float(row.get('Withdrawal', 0) or 0)
#         deposit = float(row.get('Deposit', 0) or 0)
#         description = row.get("Description", "")
        
#         classification = classify_category(description, withdrawal, deposit)
        
#         categories[classification]['count'] += 1
        
#         # Handle refunds: they are deposits but should reduce the withdrawal amount
#         # not add to deposit for expense calculation purposes
#         if "REFUND" in description.upper():
#             # Refunds reduce the net expense of that category
#             categories[classification]['withdraw'] -= deposit
#             categories[classification]['deposit'] += deposit
#         else:
#             categories[classification]['withdraw'] += withdrawal
#             categories[classification]['deposit'] += deposit
        
#         results.append(classification)
    
#     # Calculate totals
#     total_deposits = sum(categories[category]['deposit'] for category in categories)
    
#     # Net expenses after refunds (withdrawals already adjusted for refunds)
#     non_mandatory_expenses = (
#         categories['Non-Mandatory (Food/Grocery/Households)']['withdraw'] +
#         categories['Travel']['withdraw'] + 
#         categories['Luxury/Discretionary']['withdraw']
#     )
    
#     mandatory_expenses = (
#         categories['Mandatory/Utility']['withdraw'] + 
#         categories['Investment/Savings']['withdraw']
#     )
    
#     total_expenses = mandatory_expenses + non_mandatory_expenses
    
#     # Determine dominant transaction class
#     transactions_class = ""
#     max_withdrawal = -1
    
#     for category in categories:
#         if categories[category]['withdraw'] > max_withdrawal:
#             transactions_class = category
#             max_withdrawal = categories[category]['withdraw']
    
#     # Classify as mandatory or non-mandatory
#     if transactions_class in ["Non-Mandatory (Food/Grocery/Households)", "Travel", "Luxury/Discretionary"]:
#         transactions_class = "non-mandatory"
#     else:
#         transactions_class = "mandatory"
    
#     print('\n\nRESULTS:\n', results, "\n")
#     print('NUM_RESULTS:\t', len(results), "\n")
#     print('CATEGORIES:\n', json.dumps(categories, indent=2))
    
#     return {
#         "classification_details": {
#             "transactions_net_classification": transactions_class,
#             "transaction_category": categories,
#             "total_expenses": total_expenses,
#             "non_mandatory_expenses": non_mandatory_expenses,
#             "total_deposits": total_deposits,
#             "total_balance": total_deposits - total_expenses,
#         }
#     }








import json


def classify_category(description, withdrawal, deposit):
    """
    Classify transaction based on description.
    This function needs to be implemented based on your classification rules.
    """
    description_lower = description.lower()
    
    # Opening balance
    if "opening balance" in description_lower:
        return "Opening"
    
    # Mandatory/Utility
    if any(keyword in description_lower for keyword in [
        "salary", "internet bill", "medplus", "lic premium", 
        "emi-home loan", "atm withdrawal", "apollo hospital"
    ]):
        return "Mandatory/Utility"
    
    # Investment/Savings
    if any(keyword in description_lower for keyword in [
        "stock purchase", "gold investment", "rd installment"
    ]):
        return "Investment/Savings"
    
    # Travel
    if any(keyword in description_lower for keyword in [
        "makemytrip", "hotel booking", "ola", "flight booking", "oyo rooms"
    ]):
        return "Travel"
    
    # Luxury/Discretionary
    if any(keyword in description_lower for keyword in [
        "h&m", "starbucks", "bookmyshow", "gym", "adidas"
    ]):
        return "Luxury/Discretionary"
    
    # Non-Mandatory (Food/Grocery/Households)
    if any(keyword in description_lower for keyword in [
        "bigbasket", "swiggy", "zomato", "star bazaar", "zepto"
    ]):
        return "Non-Mandatory (Food/Grocery/Households)"
    
    # Adjustment
    if "month-end refund" in description_lower or "adjustment" in description_lower:
        return "Adjustment"
    
    # Default to non-mandatory if unclear
    return "Non-Mandatory (Food/Grocery/Households)"


def generate_analytics(data):
    categories = {
        "Opening": {
            "type": "",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Mandatory/Utility": {
            "type": "mandatory",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Investment/Savings": {
            "type": "mandatory",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Non-Mandatory (Food/Grocery/Households)": {
            "type": "non-mandatory",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Luxury/Discretionary": {
            "type": "non-mandatory",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Adjustment": {
            "type": "",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
        "Travel": {
            "type": "non-mandatory",
            "count": 0,
            "withdraw": 0,
            "deposit": 0
        },
    }
    
    results = []
    
    for row in data["data"]:
        withdrawal = float(row.get('Withdrawal', 0) or 0)
        deposit = float(row.get('Deposit', 0) or 0)
        description = row.get("Description", "")
        
        classification = classify_category(description, withdrawal, deposit)
        
        categories[classification]['count'] += 1
        
        # Handle refunds: they are deposits but should reduce the withdrawal amount
        # not add to deposit for expense calculation purposes
        if "REFUND" in description.upper():
            # Refunds reduce the net expense of that category
            categories[classification]['withdraw'] -= deposit
            categories[classification]['deposit'] += deposit
        else:
            categories[classification]['withdraw'] += withdrawal
            categories[classification]['deposit'] += deposit
        
        results.append(classification)
    
    # Calculate totals
    total_deposits = sum(categories[category]['deposit'] for category in categories)
    
    # Net expenses after refunds (withdrawals already adjusted for refunds)
    non_mandatory_expenses = (
        categories['Non-Mandatory (Food/Grocery/Households)']['withdraw'] +
        categories['Travel']['withdraw'] + 
        categories['Luxury/Discretionary']['withdraw']
    )
    
    mandatory_expenses = (
        categories['Mandatory/Utility']['withdraw'] + 
        categories['Investment/Savings']['withdraw']
    )
    
    total_expenses = mandatory_expenses + non_mandatory_expenses
    
    # Determine dominant transaction class
    transactions_class = ""
    max_withdrawal = -1
    
    for category in categories:
        if categories[category]['withdraw'] > max_withdrawal:
            transactions_class = category
            max_withdrawal = categories[category]['withdraw']
    
    # Classify as mandatory or non-mandatory
    if transactions_class in ["Non-Mandatory (Food/Grocery/Households)", "Travel", "Luxury/Discretionary"]:
        transactions_class = "non-mandatory"
    else:
        transactions_class = "mandatory"
    
    print('\n\nRESULTS:\n', results, "\n")
    print('NUM_RESULTS:\t', len(results), "\n")
    print('CATEGORIES:\n', json.dumps(categories, indent=2))
    
    return {
        "classification_details": {
            "transactions_net_classification": transactions_class,
            "transaction_category": categories,
            "total_expenses": total_expenses,
            "non_mandatory_expenses": non_mandatory_expenses,
            "total_deposits": total_deposits,
            "total_balance": total_deposits - total_expenses,
        }
    }