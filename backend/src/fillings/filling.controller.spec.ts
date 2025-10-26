import { Test, TestingModule } from '@nestjs/testing';
import { FillingController } from './filling.controller';
import { FillingService } from './filling.service';
import { CreateFillingDTO } from './dto/create-fillings.dto';
import { UpdateFillingDTO } from './dto/update-fillings.dto';
import { NotFoundException } from '@nestjs/common';

describe('FillingController', () => {
  let controller: FillingController;
  let fillingService: FillingService;

  const mockFillingService = {
    addFilling: jest.fn(),
    getAllFillings: jest.fn(),
    getSingleFilling: jest.fn(),
    updateFilling: jest.fn(),
    deleteFilling: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FillingController],
      providers: [{ provide: FillingService, useValue: mockFillingService}],
    }).compile();

    controller = module.get<FillingController>(FillingController);
    fillingService = module.get<FillingService>(FillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addFilling', () => {
    it('should call fillingService.addFilling and return the new filling id wrapped in a data object', async () => {
      const dto: CreateFillingDTO = {
        name: 'Chocolate Filling',
        ingredients: '100 g sugar\n250 g flour\n100 g chocolate',
        instructions: 'Bake at 180°C for 30 minutes',
        quantity: 1,
        tags: [],
        image: ''
      };
      const fillingId = '123';
      mockFillingService.addFilling.mockResolvedValue(fillingId);

      const result = await controller.addFilling(dto);

      expect(fillingService.addFilling).toHaveBeenCalledWith(
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity,
        dto.tags,
        dto.image,
      );
      expect(result).toEqual({ data: fillingId });
    });
  });

  describe('getAllFilling', () => {
    it('should return an array of fillings', async () => {
      const fillings = [
        { id: '1', name: 'Filling 1', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1, tags: [] },
        { id: '2', name: 'Filling 2', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1, tags: [] },
      ];
      mockFillingService.getAllFillings.mockResolvedValue(fillings);

      const result = await controller.getAllFilling();

      expect(fillingService.getAllFillings).toHaveBeenCalled();
      expect(result).toEqual({ data: fillings });
    });
  });

  describe('getSingleFilling', () => {
    it('should return a single filling when found', async () => {
      const filling = { id: '1', name: 'Filling 1', ingredients: [], instructions: 'Test', quantity: 1 };
      mockFillingService.getSingleFilling.mockResolvedValue(filling);

      const result = await controller.getSingleFilling('1');

      expect(fillingService.getSingleFilling).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: filling });
    });
    it('should propagate NotFoundException if filling is not found', async () => {
      mockFillingService.getSingleFilling.mockRejectedValue(new NotFoundException('Filling not found'));

      await expect(controller.getSingleFilling('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });


describe('updateFilling', () => {
    it('should update a filling and return the updated filling wrapped in a data object', async () => {
      const dto: UpdateFillingDTO = {
        id: '1',
        name: 'Updated Filling',
        ingredients: '100 g sugar\n300 g flour\n150 g chocolate, 50 ml Milk',
        instructions: 'Updated instructions',
        quantity: 2,
        tags: [],
        image: ""
      };
      const updatedFilling = {
        id: '1',
        name: 'Updated Filling',
        ingredients: [],
        instructions: dto.instructions,
        quantity: 2,
        tags: [],
        image: ""
      };
      mockFillingService.updateFilling.mockResolvedValue(updatedFilling);

      const result = await controller.updateFilling(dto);

      expect(fillingService.updateFilling).toHaveBeenCalledWith(
        dto.id,
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity,
        dto.tags,
        dto.image,
      );
      expect(result).toEqual({ data: updatedFilling });
    });
  });

  describe('deleteFilling', () => {
    it('should call deleteFilling on the service and return null', async () => {
      mockFillingService.deleteFilling.mockResolvedValue(null);

      const result = await controller.deleteFilling('1');

      expect(fillingService.deleteFilling).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: null });
    });
  });
});
