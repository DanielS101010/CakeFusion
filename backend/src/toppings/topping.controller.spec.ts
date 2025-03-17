import { Test, TestingModule } from '@nestjs/testing';
import { ToppingController } from './topping.controller';
import { ToppingService } from './topping.service';
import { CreateToppingDTO } from './dto/create-toppings.dto';
import { UpdateToppingDTO } from './dto/update-toppings.dto';
import { NotFoundException } from '@nestjs/common';

describe('ToppingController', () => {
  let controller: ToppingController;
  let toppingService: ToppingService;

  const mockToppingService = {
    addTopping: jest.fn(),
    getAllToppings: jest.fn(),
    getSingleTopping: jest.fn(),
    updateTopping: jest.fn(),
    deleteTopping: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToppingController],
      providers: [{ provide: ToppingService, useValue: mockToppingService}],
    }).compile();

    controller = module.get<ToppingController>(ToppingController);
    toppingService = module.get<ToppingService>(ToppingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addTopping', () => {
    it('should call toppingService.addTopping and return the new topping id wrapped in a data object', async () => {
      const dto: CreateToppingDTO = {
        name: 'Chocolate Topping',
        ingredients: '100 g sugar\n250 g flour\n100 g chocolate',
        instructions: 'Bake at 180°C for 30 minutes',
        quantity: 1
      };
      const toppingId = '123';
      mockToppingService.addTopping.mockResolvedValue(toppingId);

      const result = await controller.addTopping(dto);

      expect(toppingService.addTopping).toHaveBeenCalledWith(
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity,
      );
      expect(result).toEqual({ data: toppingId });
    });
  });

  describe('getAllTopping', () => {
    it('should return an array of toppings', async () => {
      const toppings = [
        { id: '1', name: 'Topping 1', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1 },
        { id: '2', name: 'Topping 2', ingredients: ['100 g Flour, 20 ml Milk'], instructions: 'Test', quantity: 1 },
      ];
      mockToppingService.getAllToppings.mockResolvedValue(toppings);

      const result = await controller.getAllTopping();

      expect(toppingService.getAllToppings).toHaveBeenCalled();
      expect(result).toEqual({ data: toppings });
    });
  });

  describe('getSingleTopping', () => {
    it('should return a single topping when found', async () => {
      const topping = { id: '1', name: 'Topping 1', ingredients: [], instructions: 'Test', quantity: 1 };
      mockToppingService.getSingleTopping.mockResolvedValue(topping);

      const result = await controller.getSingleTopping('1');

      expect(toppingService.getSingleTopping).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: topping });
    });
    it('should propagate NotFoundException if topping is not found', async () => {
      mockToppingService.getSingleTopping.mockRejectedValue(new NotFoundException('Topping not found'));

      await expect(controller.getSingleTopping('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });


describe('updateTopping', () => {
    it('should update a topping and return the updated topping wrapped in a data object', async () => {
      const dto: UpdateToppingDTO = {
        id: '1',
        name: 'Updated Topping',
        ingredients: '100 g sugar\n300 g flour\n150 g chocolate, 50 ml Milk',
        instructions: 'Updated instructions',
        quantity: 2,
      };
      const updatedTopping = {
        id: '1',
        name: 'Updated Topping',
        ingredients: [],
        instructions: dto.instructions,
        quantity: 2,
      };
      mockToppingService.updateTopping.mockResolvedValue(updatedTopping);

      const result = await controller.updateTopping(dto);

      expect(toppingService.updateTopping).toHaveBeenCalledWith(
        dto.id,
        dto.name,
        dto.ingredients,
        dto.instructions,
        dto.quantity
      );
      expect(result).toEqual({ data: updatedTopping });
    });
  });

  describe('deleteTopping', () => {
    it('should call deleteTopping on the service and return null', async () => {
      mockToppingService.deleteTopping.mockResolvedValue(null);

      const result = await controller.deleteTopping('1');

      expect(toppingService.deleteTopping).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: null });
    });
  });
});
