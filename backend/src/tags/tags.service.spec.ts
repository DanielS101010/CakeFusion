import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TagsService } from './tags.service';

describe('TagsService (with mocks)', () => {
  let service: TagsService;
  let tagModel: any;

  const mockSave = jest.fn();

  const mockTagModel = Object.assign(
    jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: mockSave,
    })),
    {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    }
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getModelToken('Tags'), useValue: mockTagModel },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagModel = module.get(getModelToken('Tags'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTag', () => {
    it('should create a new tag, call save(), and return its id', async () => {
      const tagName = 'Test Tag';
      const fakeId = '12345';
      
      mockSave.mockResolvedValueOnce({ _id: fakeId });
      
      const returnedId = await service.addTag(tagName);
      
      expect(tagModel).toHaveBeenCalledWith({ name: tagName });
      expect(mockSave).toHaveBeenCalled();
      expect(returnedId).toBe(fakeId);
    });

    it('should propagate an error if save fails', async () => {
      const tagName = 'Error Tag';
      const errorMessage = 'Save failed';
      
      mockSave.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.addTag(tagName)).rejects.toThrow(errorMessage);
    });
  });

  describe('getAllTags', () => {
    it('should return an array of tags', async () => {
      const tagsArray = [
        { _id: '1', name: 'Tag One' },
        { _id: '2', name: 'Tag Two' }
      ];
      
      tagModel.find.mockResolvedValueOnce(tagsArray);
      
      const result = await service.getAllTags();
      expect(result).toEqual(tagsArray);
      expect(tagModel.find).toHaveBeenCalled();
    });

    it('should propagate an error if find fails', async () => {
      const errorMessage = 'Find failed';
      tagModel.find.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.getAllTags()).rejects.toThrow(errorMessage);
    });
  });

  describe('getSingleTag', () => {
    it('should return a single tag for a given id', async () => {
      const tag = { _id: '1', name: 'Tag One' };
      tagModel.findById.mockResolvedValueOnce(tag);
      
      const result = await service.getSingleTag('1');
      expect(result).toEqual(tag);
      expect(tagModel.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if tag is not found', async () => {
      tagModel.findById.mockResolvedValueOnce(null);
      
      const result = await service.getSingleTag('nonexistent-id');
      expect(result).toBeNull();
      expect(tagModel.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('updateTag', () => {
    it('should update a tag and return the updated document', async () => {
      const updatedTag = { _id: '1', name: 'Updated Tag' };
      tagModel.findByIdAndUpdate.mockResolvedValueOnce(updatedTag);
      
      const result = await service.updateTag('1', 'Updated Tag');
      expect(result).toEqual(updatedTag);
      expect(tagModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated Tag' });
    });

    it('should propagate an error if update fails', async () => {
      const errorMessage = 'Update failed';
      tagModel.findByIdAndUpdate.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.updateTag('1', 'fail update')).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteTag', () => {
    it('should call findByIdAndDelete with the correct id', async () => {
      tagModel.findByIdAndDelete.mockResolvedValueOnce(null);
      
      const result = await service.deleteTag('1');
      
      expect(tagModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });

    it('should propagate an error if deletion fails', async () => {
      const errorMessage = 'Deletion failed';
      tagModel.findByIdAndDelete.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.deleteTag('1')).rejects.toThrow(errorMessage);
    });
  });
});
