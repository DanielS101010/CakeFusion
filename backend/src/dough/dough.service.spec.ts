import { NotFoundException } from '@nestjs/common';
import { DoughService } from './dough.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Dough } from './dough.model';
import { getModelToken } from '@nestjs/mongoose';
import { parseIngredients } from '../shared-service/shared-service.service';

jest.mock('../shared-service/shared-service.service', () => ({
  parseIngredients: jest.fn(),
}));

describe('DoughService', () => {
  let service: DoughService;
  let doughModel: Model<Dough>;

  const mockDoughModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockDoughDocument = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoughService,
        { provide: getModelToken('Dough'), useValue: { ...mockDoughModel } },
      ],
    }).compile();

    service = module.get<DoughService>(DoughService);
    doughModel = module.get<Model<Dough>>(getModelToken('Dough'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe('addDough', () => {
  it('should add a dough and return its id', async () => {
    const name = 'Vanilla Dough';
    const ingredients = '1 sugar\n2 flour';
    const instruction = 'Mix and bake';
    const quantity = 1
    const parsedIngredients = [
      { quantity: 1, description: 'sugar' },
      { quantity: 2, description: 'flour' },
    ];

    (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

    service['doughModel'] = jest.fn().mockImplementation(() => ({
      ...mockDoughDocument,
      save: jest.fn().mockResolvedValue({ _id: '123' }),
    })) as any;

    const result = await service.addDough(name, ingredients, instruction, quantity, [], "");

    expect(parseIngredients).toHaveBeenCalledWith(ingredients);
    expect(result).toBe('123');
  });
});


  describe('getAllDoughs', () => {
    it('should return an array of doughs', async () => {
      const doughs = [
        { id: '1', name: 'Dough 1', ingredients: [], instructions: 'Test', quantity: 1 },
      ];
      (doughModel.find as jest.Mock).mockResolvedValue(doughs);

      const result = await service.getAllDoughs();

      expect(doughModel.find).toHaveBeenCalled();
      expect(result).toEqual(doughs);
    });
  });

  describe('getSingleDough', () => {
    it('should return a dough if found', async () => {
      const dough = { id: '1', name: 'Dough 1', ingredients: [], instructions: 'Test', quantity: 1, image: "" };
      (doughModel.findById as jest.Mock).mockResolvedValue(dough);

      const result = await service.getSingleDough('1');

      expect(doughModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(dough);
    });

    it('should throw NotFoundException if dough is not found', async () => {
      (doughModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getSingleDough('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDough', () => {
    it('should update and return the dough', async () => {
      const id = '1';
      const name = 'Updated Dough';
      const ingredients = '2 sugar\n3 flour';
      const instruction = 'New instructions';
      const quantity = 2
      const parsedIngredients = [
        { quantity: 2, description: 'sugar' },
        { quantity: 3, description: 'flour' },
      ];
      const tags = [];
      (parseIngredients as jest.Mock).mockReturnValue(parsedIngredients);

      const updatedDough = { id, name: name, ingredients: parsedIngredients, instructions: instruction, quantity: quantity, tags: tags, image: "" };
      (doughModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedDough);

      const result = await service.updateDough(id, name, ingredients, instruction, quantity, [], "");

      expect(parseIngredients).toHaveBeenCalledWith(ingredients);
      expect(doughModel.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        name : name,
        ingredients: parsedIngredients,
        instructions: instruction,
        quantity: quantity,
        tags: [],
        image: ""
      });
      expect(result).toEqual(updatedDough);
    });
  });

  describe('deleteDough', () => {
    it('should delete the dough', async () => {
      (doughModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await service.deleteDough('1');

      expect(doughModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
