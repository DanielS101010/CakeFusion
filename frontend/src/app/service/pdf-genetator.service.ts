import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs as pdfMakeVfs } from 'pdfmake/build/vfs_fonts';
import type {
  Content,
  ContentStack,
  ContentText,
  TDocumentDefinitions
} from 'pdfmake/interfaces';
import { ImageService } from './image.service';

export interface RecipePdfData {
  title: string;
  description: string;
  image?: string;
  imageMimeType?: string;
  imageWidth?: number;
  ingredients: string[];
  steps: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PdfGenetatorService {
  constructor(private readonly imageService: ImageService) {
    pdfMake.vfs = pdfMakeVfs;
  }

  public exportRecipe(recipe: RecipePdfData): void {
    const safeTitle =
      recipe.title?.trim().toLowerCase() || 'recipe';

    const content: Content[] = [];

    if (recipe.title) {
      content.push({
        text: recipe.title,
        style: 'title'
      });
    }

    if (recipe.description) {
      content.push({
        text: recipe.description,
        margin: [0, 0, 0, 10]
      });
    }

    const imageDataUrl = recipe.image
      ? this.imageService.toDataUrl(recipe.image, recipe.imageMimeType)
      : undefined;

    if (imageDataUrl) {
      content.push({
        image: imageDataUrl,
        width: recipe.imageWidth ?? 420,
        alignment: 'center',
        margin: [0, 0, 0, 15]
      });
    }

    if (recipe.ingredients?.length) {
      const ingredientStack: ContentStack['stack'] = recipe.ingredients.map(item => ({
        text: item,
        margin: [0, 2, 0, 0]
      })) as ContentText[];

      content.push(
        { text: 'Ingredients', style: 'section' },
        {
          stack: ingredientStack
        }
      );
    }

    if (recipe.steps?.length) {
      const instructionStack: ContentStack['stack'] = recipe.steps.map((step) => ({
        text: step,
        margin: [0, 2, 0, 0]
      })) as ContentText[];

      content.push({
        text: 'Instructions',
        style: 'section',
        margin: [0, 10, 0, 5]
      });

      content.push({
        stack: instructionStack
      });
    }

    const docDefinition: TDocumentDefinitions = {
      content,
      styles: {
        title: { fontSize: 14, margin: [0, 0, 0, 15] },
        section: { fontSize: 13}
      }
    };

    pdfMake.createPdf(docDefinition).download(`${safeTitle}.pdf`);
  }
}
