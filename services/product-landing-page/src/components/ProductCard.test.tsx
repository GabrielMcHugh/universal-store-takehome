import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { shirtProduct } from './test/fixtures';

//Just test prop tests
describe('ProductCard', () => {
  test('renders product details', () => {
    render(<ProductCard product={shirtProduct} />);

    expect(screen.getByRole('heading', { name: 'Shirt' })).toBeInTheDocument();
    expect(screen.getByText('SKU: 111111')).toBeInTheDocument();
    expect(screen.getByText('3 in stock')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Shirt' });
    expect(image).toHaveAttribute('src', shirtProduct.image);
  });
});