import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';
import { hatProduct, shirtProduct } from './test/fixtures';

describe('ProductList', () => {
  test('renders a card for each product', () => {
    render(<ProductList products={[shirtProduct, hatProduct]} />);

    expect(screen.getByRole('heading', { name: 'Shirt' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hat' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});