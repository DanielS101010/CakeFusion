import { Injectable } from '@nestjs/common';

export function parseIngredients(ingredients: string): { quantity: number; description: string }[] {
    return ingredients.split('\n').map(line => {
      const trimmedLine = line.trim();
      const regex = /^(\d+(?:\.\d+)?)(.*)$/;
      const match = trimmedLine.match(regex);
      if (match) {
        return { quantity: parseFloat(match[1]), description: match[2].trim() };
      }
      return { quantity: 0, description: trimmedLine };
    });
  }
  