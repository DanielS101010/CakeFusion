import { NotFoundException } from '@nestjs/common';
import { ToppingService } from './topping.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Topping } from './topping.model';
import { getModelToken } from '@nestjs/mongoose';
import { parseIngredients } from '../shared-service/shared-service.service';

jest.mock('../shared-service/shared-service.service', () => ({
  parseIngredients: jest.fn(),
}));

describe('ToppingService', () => {
  let service: ToppingService;
  let toppingModel: Model<Topping>;

  const mockToppingModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockToppingDocument = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToppingService,
        { provide: getModelToken('Topping'), useValue: { ...mockToppingModel } },
      ],
    }).compile();

    service = module.get<ToppingService>(ToppingService);
    toppingModel = module.get<Model<Topping>>(getModelToken('Topping'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe('addTopping', () => {
  it('should add a topping and return its id', async () => {
    const name = 'Vanilla Topping';
    const ingredients = '1 sugar\n2 flour';
    const instruction = 'Mix and bake';
    const quantity = 1
    const parsedIngredients = [
      { quantity: 1, description: 'sugar' },
      { quantity: 2, description: 'flour' },
    ];
    const tags = [];

    (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

    service['toppingModel'] = jest.fn().mockImplementation(() => ({
      ...mockToppingDocument,
      save: jest.fn().mockResolvedValue({ _id: '123' }),
    })) as any;

    const result = await service.addTopping(name, ingredients, instruction, quantity, tags, "");

    expect(parseIngredients).toHaveBeenCalledWith(ingredients);
    expect(result).toBe('123');
  });
});


  describe('getAllToppings', () => {
    it('should return an array of toppings', async () => {
      const toppings = [
        { id: '1', name: 'Topping 1', ingredients: [], instructions: 'Test', quantity: 1 },
      ];
      (toppingModel.find as jest.Mock).mockResolvedValue(toppings);

      const result = await service.getAllToppings();

      expect(toppingModel.find).toHaveBeenCalled();
      expect(result).toEqual(toppings);
    });
  });

  describe('getSingleTopping', () => {
    it('should return a topping if found', async () => {
      const topping = { id: '1', name: 'Topping 1', ingredients: [], instructions: 'Test', quantity: 1 };
      (toppingModel.findById as jest.Mock).mockResolvedValue(topping);

      const result = await service.getSingleTopping('1');

      expect(toppingModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(topping);
    });

    it('should throw NotFoundException if topping is not found', async () => {
      (toppingModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getSingleTopping('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTopping', () => {
    it('should update and return the topping', async () => {
      const id = '1';
      const name = 'Updated Topping';
      const ingredients = '2 sugar\n3 flour';
      const instruction = 'New instructions';
      const quantity = 2
      const parsedIngredients = [
        { quantity: 2, description: 'sugar' },
        { quantity: 3, description: 'flour' },
      ];
      const tags = [];
      (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

      const updatedTopping = { id, name: name, ingredients: parsedIngredients, instructions: instruction, quantity: quantity };
      (toppingModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTopping);

      const result = await service.updateTopping(id, name, ingredients, instruction, quantity, tags, "");

      expect(parseIngredients).toHaveBeenCalledWith(ingredients);
      expect(toppingModel.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        name : name,
        ingredients: parsedIngredients,
        instructions: instruction,
        quantity: quantity,
        tags: tags,
        image: ""
      });
      expect(result).toEqual(updatedTopping);
    });
  });

  describe('deleteTopping', () => {
    it('should delete the topping', async () => {
      (toppingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await service.deleteTopping('1');

      expect(toppingModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
