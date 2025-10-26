import { NotFoundException } from '@nestjs/common';
import { CakeService } from './cake.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Cake } from './cake.model';
import { getModelToken } from '@nestjs/mongoose';
import { parseIngredients } from '../shared-service/shared-service.service';

jest.mock('../shared-service/shared-service.service', () => ({
  parseIngredients: jest.fn(),
}));

describe('CakeService', () => {
  let service: CakeService;
  let cakeModel: Model<Cake>;

  const mockCakeModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockCakeDocument = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CakeService,
        { provide: getModelToken('Cake'), useValue: { ...mockCakeModel } },
      ],
    }).compile();

    service = module.get<CakeService>(CakeService);
    cakeModel = module.get<Model<Cake>>(getModelToken('Cake'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe('addCake', () => {
  it('should add a cake and return its id', async () => {
    const name = 'Vanilla Cake';
    const components = [{ type: 'dough', id: '1', quantity: 1 }];
    const ingredients = '1 sugar\n2 flour';
    const instruction = 'Mix and bake';
    const parsedIngredients = [
      { quantity: 1, description: 'sugar' },
      { quantity: 2, description: 'flour' },

    ];
    const tags: string[] = [];

    (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

    service['cakeModel'] = jest.fn().mockImplementation(() => ({
      ...mockCakeDocument,
      save: jest.fn().mockResolvedValue({ _id: '123' }),
    })) as any;

    const result = await service.addCake(name, components, ingredients, instruction, tags, "");

    expect(parseIngredients).toHaveBeenCalledWith(ingredients);
    expect(result).toBe('123');
  });
});


  describe('getAllCakes', () => {
    it('should return an array of cakes', async () => {
      const cakes = [
        { id: '1', name: 'Cake 1', components: [], ingredients: [], instructions: 'Test' },
      ];
      (cakeModel.find as jest.Mock).mockResolvedValue(cakes);

      const result = await service.getAllCakes();

      expect(cakeModel.find).toHaveBeenCalled();
      expect(result).toEqual(cakes);
    });
  });

  describe('getSingleCake', () => {
    it('should return a cake if found', async () => {
      const cake = { id: '1', name: 'Cake 1', components: [], ingredients: [], instructions: 'Test' };
      (cakeModel.findById as jest.Mock).mockResolvedValue(cake);

      const result = await service.getSingleCake('1');

      expect(cakeModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(cake);
    });

    it('should throw NotFoundException if cake is not found', async () => {
      (cakeModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getSingleCake('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCake', () => {
    it('should update and return the cake', async () => {
      const id = '1';
      const name = 'Updated Cake';
      const components = [];
      const ingredients = '2 sugar\n3 flour';
      const instruction = 'New instructions';
      const parsedIngredients = [
        { quantity: 2, description: 'sugar' },
        { quantity: 3, description: 'flour' },
      ];
      const tags: string[] = [];

      (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

      const updatedCake = { id, name, components, ingredients: parsedIngredients, instructions: instruction };
      (cakeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedCake);

      const result = await service.updateCake(id, name, components, ingredients, instruction, tags, "");

      expect(parseIngredients).toHaveBeenCalledWith(ingredients);
      expect(cakeModel.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        name,
        components,
        ingredients: parsedIngredients,
        instructions: instruction,
        tags: tags,
        image: "",
      });
      expect(result).toEqual(updatedCake);
    });
  });

  describe('deleteCake', () => {
    it('should delete the cake', async () => {
      (cakeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await service.deleteCake('1');

      expect(cakeModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
