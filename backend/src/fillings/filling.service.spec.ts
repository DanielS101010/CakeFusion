import { NotFoundException } from '@nestjs/common';
import { FillingService } from './filling.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Filling } from './filling.model';
import { getModelToken } from '@nestjs/mongoose';
import { parseIngredients } from '../shared-service/shared-service.service';

jest.mock('../shared-service/shared-service.service', () => ({
  parseIngredients: jest.fn(),
}));

describe('FillingService', () => {
  let service: FillingService;
  let fillingModel: Model<Filling>;

  const mockFillingModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockFillingDocument = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FillingService,
        { provide: getModelToken('Filling'), useValue: { ...mockFillingModel } },
      ],
    }).compile();

    service = module.get<FillingService>(FillingService);
    fillingModel = module.get<Model<Filling>>(getModelToken('Filling'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe('addFilling', () => {
  it('should add a filling and return its id', async () => {
    const name = 'Vanilla Filling';
    const ingredients = '1 sugar\n2 flour';
    const instruction = 'Mix and bake';
    const quantity = 1
    const parsedIngredients = [
      { quantity: 1, description: 'sugar' },
      { quantity: 2, description: 'flour' },
    ];
    const tags: string[] = [];

    (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

    service['fillingModel'] = jest.fn().mockImplementation(() => ({
      ...mockFillingDocument,
      save: jest.fn().mockResolvedValue({ _id: '123' }),
    })) as any;

    const result = await service.addFilling(name, ingredients, instruction, quantity, tags);

    expect(parseIngredients).toHaveBeenCalledWith(ingredients);
    expect(result).toBe('123');
  });
});


  describe('getAllFillings', () => {
    it('should return an array of fillings', async () => {
      const fillings = [
        { id: '1', name: 'Filling 1', ingredients: [], instructions: 'Test', quantity: 1 },
      ];
      (fillingModel.find as jest.Mock).mockResolvedValue(fillings);

      const result = await service.getAllFillings();

      expect(fillingModel.find).toHaveBeenCalled();
      expect(result).toEqual(fillings);
    });
  });

  describe('getSingleFilling', () => {
    it('should return a filling if found', async () => {
      const filling = { id: '1', name: 'Filling 1', ingredients: [], instructions: 'Test', quantity: 1 };
      (fillingModel.findById as jest.Mock).mockResolvedValue(filling);

      const result = await service.getSingleFilling('1');

      expect(fillingModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(filling);
    });

    it('should throw NotFoundException if filling is not found', async () => {
      (fillingModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getSingleFilling('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFilling', () => {
    it('should update and return the filling', async () => {
      const id = '1';
      const name = 'Updated Filling';
      const ingredients = '2 sugar\n3 flour';
      const instruction = 'New instructions';
      const quantity = 2
      const parsedIngredients = [
        { quantity: 2, description: 'sugar' },
        { quantity: 3, description: 'flour' },
      ];
      (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

      const updatedFilling = { id, name: name, ingredients: parsedIngredients, instructions: instruction, quantity: quantity };
      (fillingModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedFilling);

      const result = await service.updateFilling(id, name, ingredients, instruction, quantity);

      expect(parseIngredients).toHaveBeenCalledWith(ingredients);
      expect(fillingModel.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        name : name,
        ingredients: parsedIngredients,
        instructions: instruction,
        quantity: quantity,
      });
      expect(result).toEqual(updatedFilling);
    });
  });

  describe('deleteFilling', () => {
    it('should delete the filling', async () => {
      (fillingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await service.deleteFilling('1');

      expect(fillingModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
