import { allPictures, firstPicture } from './picture';

describe('picture utils', () => {
  it('should return the first picture', () => {
    expect(firstPicture(['a.jpg', 'b.jpg'])).toBe('a.jpg');
    expect(firstPicture('c.jpg')).toBe('c.jpg');
    expect(firstPicture(null)).toBe('');
  });

  it('should return all pictures as an array', () => {
    expect(allPictures('c.jpg')).toEqual(['c.jpg']);
    expect(allPictures(['a.jpg', '', 'b.jpg'])).toEqual(['a.jpg', 'b.jpg']);
    expect(allPictures(undefined)).toEqual([]);
  });
});
