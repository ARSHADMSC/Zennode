products = {
    "Product A": 20,
    "Product B": 40,
    "Product C": 50
}

quantities = {
    "Product A": 25,
    "Product B": 8,
    "Product C": 10
}

discount_rules = {
    "flat_10_discount": {"threshold": 200, "discount": 10},
    "bulk_5_discount": {"threshold": 10, "discountPercentage": 5},
    "bulk_10_discount": {"threshold": 20, "discountPercentage": 10},
    "tiered_50_discount": {"totalQuantityThreshold": 30, "singleProductThreshold": 15, "discountPercentage": 50}
}

gift_wrap_fee = 1
units_per_package = 10
shipping_fee_per_package = 5

def calculate_total(quantity, price):
    return quantity * price

def calculate_cart_total(totals):
    return sum(totals.values())


def calculate_discount(cart_total, quantities, products, discount_rules):
    applied_discount = None
    discount_amount = 0

    for rule, rule_config in discount_rules.items():
        if rule == "flat_10_discount" and cart_total > rule_config["threshold"]:
            applied_discount = rule
            discount_amount = rule_config["discount"]
        elif rule == "bulk_5_discount":
            for product, qty in quantities.items():
                if qty > rule_config["threshold"]:
                    applied_discount = rule
                    discount_amount = calculate_total(qty, products[product]) * (
                        rule_config["discountPercentage"] / 100)
                    break
        elif rule == "bulk_10_discount" and sum(quantities.values()) > rule_config["threshold"]:
            applied_discount = rule
            discount_amount = cart_total * (rule_config["discountPercentage"] / 100)
        elif rule == "tiered_50_discount" and sum(quantities.values()) > rule_config["totalQuantityThreshold"]:
            for product, qty in quantities.items():
                if qty > rule_config["singleProductThreshold"]:
                    applied_discount = rule
                    discount_amount = (qty - rule_config["singleProductThreshold"]) * (
                        products[product] * (rule_config["discountPercentage"] / 100))
                    break

    return {"appliedDiscount": applied_discount, "discountAmount": discount_amount}



def calculate_gift_wrap_fee(quantities):
    return sum(quantity * gift_wrap_fee for quantity in quantities.values())


def calculate_shipping_fee(total_quantity):
    return (total_quantity + units_per_package - 1) // units_per_package * shipping_fee_per_package


# Calculate total for each product
totals = {product: calculate_total(quantities[product], products[product]) for product in quantities}

# Calculate cart total
cart_total = calculate_cart_total(totals)

# Apply discounts
applied_discount, discount_amount = apply_discount(cart_total)

# Calculate additional fees
gift_wrap_fee_total = calculate_gift_wrap_fee(quantities)
shipping_fee_total = calculate_shipping_fee(sum(quantities.values()))

# Display results
print("Product Details :", products)
print("Total for each product:")
for product, total in totals.items():
    print(f"{product}: ${total}")

print("\nDiscount Applied:", applied_discount or "None")
print("Discount Amount: $", discount_amount)
print("Gift Wrap Fee: $", gift_wrap_fee_total)
print("Shipping Fee: $", shipping_fee_total)