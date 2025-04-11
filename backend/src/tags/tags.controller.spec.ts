import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const mockTagsService = {
    addTag: jest.fn((name: string) => Promise.resolve({ id: '1', name })),
    getAllTags: jest.fn(() => Promise.resolve([{ id: '1', name: 'Test Tag' }])),
    getSingleTag: jest.fn((id: string) => Promise.resolve({ id, name: 'Test Tag' })),
    updateTag: jest.fn((id: string, name: string) => Promise.resolve({ id, name })),
    deleteTag: jest.fn((id: string) => Promise.resolve({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addTag', () => {
    it('should add a tag and return the created tag', async () => {
      const createTagDto = { name: 'New Tag' };
      const expectedTag = { id: '1', name: 'New Tag' };

      const result = await controller.addTag(createTagDto);
      expect(result).toEqual({ data: expectedTag });
      expect(service.addTag).toHaveBeenCalledWith('New Tag');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const expectedTags = [{ id: '1', name: 'Test Tag' }];
      const result = await controller.getAllTags();
      expect(result).toEqual({ data: expectedTags });
      expect(service.getAllTags).toHaveBeenCalled();
    });
  });

  describe('getSingleTag', () => {
    it('should return a single tag by id', async () => {
      const tagId = '1';
      const expectedTag = { id: tagId, name: 'Test Tag' };
      const result = await controller.getSingleTag(tagId);
      expect(result).toEqual({ data: expectedTag });
      expect(service.getSingleTag).toHaveBeenCalledWith(tagId);
    });
  });

  describe('updateTag', () => {
    it('should update a tag and return the updated tag', async () => {
      const updateTagDto = { id: '1', name: 'Updated Tag' };
      const expectedTag = { id: '1', name: 'Updated Tag' };
      const result = await controller.updateTag(updateTagDto);
      expect(result).toEqual({ data: expectedTag });
      expect(service.updateTag).toHaveBeenCalledWith('1', 'Updated Tag');
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag and return deletion status', async () => {
      const tagId = '1';
      const expectedResponse = { deleted: true };
      const result = await controller.deleteTag(tagId);
      expect(result).toEqual({ data: expectedResponse });
      expect(service.deleteTag).toHaveBeenCalledWith(tagId);
    });
  });
});
