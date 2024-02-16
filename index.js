
 const products = {
    "Product A": 20,
    "Product B": 40,
    "Product C": 50
  };
  
  const quantities = {
    "Product A": 25,
    "Product B": 8,
    "Product C": 10
  };
  
  const discountRules = {
    "flat_10_discount": { threshold: 200, discount: 10 },
    "bulk_5_discount": { threshold: 10, discountPercentage: 5 },
    "bulk_10_discount": { threshold: 20, discountPercentage: 10 },
    "tiered_50_discount": { totalQuantityThreshold: 30, singleProductQuantityThreshold: 15, discountPercentage: 50 }
  };
  
  const giftWrapFee = 1;
  const unitsPerPackage = 10;
  const shippingFeePerPackage = 5;
  
  function calculateTotal(quantity, price) {
    return quantity * price;
  }
  
  function calculateCartTotal(totals) {
    return Object.values(totals).reduce((total, productTotal) => total + productTotal, 0);
  }
  
  function applyDiscount(cartTotal) {
    let appliedDiscount = null;
    let discountAmount = 0;
  
    for (const rule in discountRules) {
      const ruleConfig = discountRules[rule];
  
      switch (rule) {
        case "flat_10_discount":
          if (cartTotal > ruleConfig.threshold) {
            appliedDiscount = rule;
            discountAmount = ruleConfig.discount;
          }
          break;
  
        case "bulk_5_discount":
          for (const product in quantities) {
            if (quantities[product] > ruleConfig.threshold) {
              appliedDiscount = rule;
              discountAmount = calculateTotal(quantities[product], products[product]) * (ruleConfig.discountPercentage / 100);
              break;
            }
          }
          break;
  
        case "bulk_10_discount":
          if (Object.values(quantities).reduce((total, qty) => total + qty, 0) > ruleConfig.threshold) {
            appliedDiscount = rule;
            discountAmount = cartTotal * (ruleConfig.discountPercentage / 100);
          }
          break;
  
        case "tiered_50_discount":
          if (Object.values(quantities).reduce((total, qty) => total + qty, 0) > ruleConfig.totalQuantityThreshold) {
            for (const product in quantities) {
              if (quantities[product] > ruleConfig.singleProductQuantityThreshold) {
                appliedDiscount = rule;
                discountAmount = (quantities[product] - ruleConfig.singleProductQuantityThreshold) * (products[product] * (ruleConfig.discountPercentage / 100));
                break;
              }
            }
          }
          break;
      }
    }
  
    return { appliedDiscount, discountAmount };
  }
  
  function calculateGiftWrapFee(quantities) {
    return Object.values(quantities).reduce((totalFee, quantity) => totalFee + (quantity * giftWrapFee), 0);
  }
  
  function calculateShippingFee(totalQuantity) {
    return Math.ceil(totalQuantity / unitsPerPackage) * shippingFeePerPackage;
  }
  
  // Calculate total for each product
  const totals = {};
  for (const product in quantities) {
    totals[product] = calculateTotal(quantities[product], products[product]);
  }
  
  // Calculate cart total
  const cartTotal = calculateCartTotal(totals);
  
  // Apply discounts
  const { appliedDiscount, discountAmount } = applyDiscount(cartTotal);
  
  // Calculate additional fees
  const giftWrapFeeTotal = calculateGiftWrapFee(quantities);
  const shippingFeeTotal = calculateShippingFee(Object.values(quantities).reduce((total, qty) => total + qty, 0));
  
  // Display results
  console.log("Product Details :", products);
  console.log("Total for each product:");
  for (const product in totals) {
    console.log(`${product}: $${totals[product]}`);
  }
  
  console.log("\nDiscount Applied:", appliedDiscount || "None");
  console.log("Discount Amount: $", discountAmount);
  console.log("Gift Wrap Fee: $", giftWrapFeeTotal);
  console.log("Shipping Fee: $", shippingFeeTotal);
 
  
