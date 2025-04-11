import { Test, TestingModule } from '@nestjs/testing';
import { DoughController } from './dough.controller';
import { DoughService } from './dough.service';
import { CreateDoughDTO } from './dto/create-dough.dto';
import { UpdateDoughDTO } from './dto/update-dough.dto';
import { NotFoundException } from '@nestjs/common';

describe('DoughController', () => {
  let controller: DoughController;
  let doughService: DoughService;

  const mockDoughService = {
    addDough: jest.fn(),
    getAllDoughs: jest.fn(),
    getSingleDough: jest.fn(),
    updateDough: jest.fn(),
    deleteDough: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoughController],
      providers: [{ provide: DoughService, useValue: mockDoughService}],
    }).compile();

    controller = module.get<DoughController>(DoughController);
    doughService = module.get<DoughService>(DoughService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addDough', () => {
    it('should call doughService.addDough and return the new dough id wrapped in a data object', async () => {
      const dto: CreateDoughDTO = {
        name: 'Chocolate Dough',
        ingredients: '100 g sugar\n250 g flour\n100 g chocolate',
        instructions: 'Bake at 180°C for 30 minutes',
        quantity: 1,
        tags: []
      };
      const doughId = '123';
      mockDoughService.addDough.mockResolvedValue(doughId);

      const result = await controller.addDough(dto);

      expect(doughService.addDough).toHaveBeenCalledWith(
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity,
        dto.tags,
      );
      expect(result).toEqual({ data: doughId });
    });
  });

  describe('getAllDough', () => {
    it('should return an array of doughs', async () => {
      const doughs = [
        { id: '1', name: 'Dough 1', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1, tags: [] },
        { id: '2', name: 'Dough 2', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1, tags: [] },
      ];
      mockDoughService.getAllDoughs.mockResolvedValue(doughs);

      const result = await controller.getAllDough();

      expect(doughService.getAllDoughs).toHaveBeenCalled();
      expect(result).toEqual({ data: doughs });
    });
  });

  describe('getSingleDough', () => {
    it('should return a single dough when found', async () => {
      const dough = { id: '1', name: 'Dough 1', ingredients: [], instructions: 'Test', quantity: 1, tags: [] };
      mockDoughService.getSingleDough.mockResolvedValue(dough);

      const result = await controller.getSingleDough('1');

      expect(doughService.getSingleDough).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: dough });
    });
    it('should propagate NotFoundException if dough is not found', async () => {
      mockDoughService.getSingleDough.mockRejectedValue(new NotFoundException('Dough not found'));

      await expect(controller.getSingleDough('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });


describe('updateDough', () => {
    it('should update a dough and return the updated dough wrapped in a data object', async () => {
      const dto: UpdateDoughDTO = {
        id: '1',
        name: 'Updated Dough',
        ingredients: '100 g sugar\n300 g flour\n150 g chocolate, 50 ml Milk',
        instructions: 'Updated instructions',
        quantity: 2,
        tags: [],
      };
      const updatedDough = {
        id: '1',
        name: 'Updated Dough',
        ingredients: [],
        instructions: dto.instructions,
        quantity: 2,
        tags: [],
      };
      mockDoughService.updateDough.mockResolvedValue(updatedDough);

      const result = await controller.updateDough(dto);

      expect(doughService.updateDough).toHaveBeenCalledWith(
        dto.id,
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity,
        dto.tags,
      );
      expect(result).toEqual({ data: updatedDough });
    });
  });

  describe('deleteDough', () => {
    it('should call deleteDough on the service and return null', async () => {
      mockDoughService.deleteDough.mockResolvedValue(null);

      const result = await controller.deleteDough('1');

      expect(doughService.deleteDough).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: null });
    });
  });
});
