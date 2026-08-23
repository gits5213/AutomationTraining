import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://dummyjson.com/products/10';

const REQUIRED_PRODUCT_FIELDS = [
  'id',
  'title',
  'description',
  'category',
  'price',
  'discountPercentage',
  'rating',
  'stock',
  'tags',
  'brand',
  'sku',
  'weight',
  'dimensions',
  'warrantyInformation',
  'shippingInformation',
  'availabilityStatus',
  'reviews',
  'returnPolicy',
  'minimumOrderQuantity',
  'meta',
  'images',
  'thumbnail',
] as const;

const REQUIRED_REVIEW_FIELDS = [
  'rating',
  'comment',
  'date',
  'reviewerName',
  'reviewerEmail',
] as const;

test.describe('GET /products/10', { tag: ['@api', '@regression'] }, () => {
  let product: Record<string, unknown>;

  test.beforeAll(async ({ request }) => {
    const response = await request.get(ENDPOINT);
    product = await response.json();
  });

  test('response status code is 200', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get(ENDPOINT);
    expect(response.status()).toBe(200);
  });

  test('response time is less than 200ms', async ({ request }) => {
    const startTime = Date.now();
    await request.get(ENDPOINT);
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(200);
  });

  test('response has the required fields', async () => {
    expect(typeof product).toBe('object');
    expect(product).not.toBeNull();
    for (const field of REQUIRED_PRODUCT_FIELDS) {
      expect(product).toHaveProperty(field);
    }
  });

  test('price is a non-negative number', async () => {
    expect(typeof product.price).toBe('number');
    expect(product.price as number).toBeGreaterThanOrEqual(0);
  });

  test('reviews array contains valid objects with required fields', async () => {
    const reviews = product.reviews as Record<string, unknown>[];

    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);

    for (const review of reviews) {
      expect(typeof review).toBe('object');
      expect(review).not.toBeNull();

      for (const field of REQUIRED_REVIEW_FIELDS) {
        expect(review).toHaveProperty(field);
      }

      expect(typeof review.rating).toBe('number');
      expect(typeof review.comment).toBe('string');
      expect(typeof review.date).toBe('string');
      expect(typeof review.reviewerName).toBe('string');
      expect(review.reviewerEmail as string).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });
});
