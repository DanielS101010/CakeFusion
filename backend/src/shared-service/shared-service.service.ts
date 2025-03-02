export function parseIngredients(ingredients: string): { quantity: number; description: string }[] {
  return ingredients
    .split('\n')
    .filter(line => line)
    .map(line => {
      const trimmedLine = line.trim();
      // Group 1: captures the numerator (integer or decimal with . or ,)
      // Group 2 (optional): captures the denominator (if a slash with optional spaces is present)
      // Group 3: captures the remaining text as description
      const regex = /^(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+(?:[.,]\d+)?))?(.*)$/;
      const match = trimmedLine.match(regex);
      
      if (match) {
        const numeratorStr = match[1];
        const denominatorStr = match[2]; // This will be undefined if there's no fraction.
        let quantity = 0;
        if (denominatorStr) {
          const numerator = parseFloat(numeratorStr.replace(',', '.'));
          const denominator = parseFloat(denominatorStr.replace(',', '.'));
          if (denominator !== 0) {
            quantity = numerator / denominator;
          }
        } else {
          quantity = parseFloat(numeratorStr.replace(',', '.'));
        }
        quantity = Math.round(quantity * 1000) / 1000
        const description = match[3].trim();
        return { quantity, description };
      }
      return { quantity: 0, description: trimmedLine };
    });
}
