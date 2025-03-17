import { Test, TestingModule } from '@nestjs/testing';
import { CakeController } from './cake.controller';
import { CakeService } from './cake.service';
import { CreateCakeDTO } from './dto/create-cake.dto';
import { UpdateCakeDTO } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';

describe('CakeController', () => {
  let controller: CakeController;
  let cakeService: CakeService;

  const mockCakeService = {
    addCake: jest.fn(),
    getAllCakes: jest.fn(),
    getSingleCake: jest.fn(),
    updateCake: jest.fn(),
    deleteCake: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CakeController],
      providers: [{ provide: CakeService, useValue: mockCakeService }],
    }).compile();

    controller = module.get<CakeController>(CakeController);
    cakeService = module.get<CakeService>(CakeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addCake', () => {
    it('should call cakeService.addCake and return the new cake id wrapped in a data object', async () => {
      const dto: CreateCakeDTO = {
        name: 'Chocolate Cake',
        components: [],
        ingredients: '100 g sugar\n250 g flour\n100 g chocolate',
        instructions: 'Bake at 180°C for 30 minutes',
      };
      const cakeId = '123';
      mockCakeService.addCake.mockResolvedValue(cakeId);

      const result = await controller.addCake(dto);

      expect(cakeService.addCake).toHaveBeenCalledWith(
        dto.name,
        dto.components,
        dto.ingredients,
        dto.instructions,
      );
      expect(result).toEqual({ data: cakeId });
    });
  });

  describe('getAllCake', () => {
    it('should return an array of cakes', async () => {
      const cakes = [
        { id: '1', name: 'Cake 1', components: [], ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test' },
        { id: '2', name: 'Cake 2', components: [], ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test' },
      ];
      mockCakeService.getAllCakes.mockResolvedValue(cakes);

      const result = await controller.getAllCake();

      expect(cakeService.getAllCakes).toHaveBeenCalled();
      expect(result).toEqual({ data: cakes });
    });
  });

  describe('getSingleCake', () => {
    it('should return a single cake when found', async () => {
      const cake = { id: '1', name: 'Cake 1', components: [], ingredients: [], instructions: 'Test' };
      mockCakeService.getSingleCake.mockResolvedValue(cake);

      const result = await controller.getSingleCake('1');

      expect(cakeService.getSingleCake).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: cake });
    });

    it('should propagate NotFoundException if cake is not found', async () => {
      mockCakeService.getSingleCake.mockRejectedValue(new NotFoundException('Cake not found'));

      await expect(controller.getSingleCake('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCake', () => {
    it('should update a cake and return the updated cake wrapped in a data object', async () => {
      const dto: UpdateCakeDTO = {
        id: '1',
        name: 'Updated Cake',
        components: [],
        ingredients: '100 g sugar\n300 g flour\n150 g chocolate, 50 ml Milk',
        instructions: 'Updated instructions',
      };
      const updatedCake = {
        id: '1',
        name: 'Updated Cake',
        components: dto.components,
        ingredients: [],
        instructions: dto.instructions,
      };
      mockCakeService.updateCake.mockResolvedValue(updatedCake);

      const result = await controller.updateCake(dto);

      expect(cakeService.updateCake).toHaveBeenCalledWith(
        dto.id,
        dto.name,
        dto.components,
        dto.ingredients,
        dto.instructions,
      );
      expect(result).toEqual({ data: updatedCake });
    });
  });

  describe('deleteCake', () => {
    it('should call deleteCake on the service and return null', async () => {
      mockCakeService.deleteCake.mockResolvedValue(null);

      const result = await controller.deleteCake('1');

      expect(cakeService.deleteCake).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: null });
    });
  });
});
