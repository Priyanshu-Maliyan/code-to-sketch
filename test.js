function calculateSum(a, b) {
    if (a > 0) {
      let sum = a + b;
      console.log("Sum:", sum);
      return sum;
    } else {
      console.log("Invalid input");
      return 0;
    }
  }
  
  calculateSum(5, 3);