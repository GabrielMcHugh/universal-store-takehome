import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { ProductCatalog } from './ProductCatalog';
import { fetchProducts } from '../api/productsClient';
import { inStockProducts } from './test/fixtures';

jest.mock('../api/productsClient');

const mockFetchProducts = fetchProducts as jest.MockedFunction<typeof fetchProducts>;

function renderProductCatalog() {
  const store = createStore();
  return render(
    <Provider store={store}>
      <ProductCatalog />
    </Provider>
  );
}

describe('ProductCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', () => {
    mockFetchProducts.mockReturnValue(new Promise(() => {}));

    renderProductCatalog();

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  test('renders in-stock products only', async () => {
    mockFetchProducts.mockResolvedValue(inStockProducts);

    renderProductCatalog();

    expect(await screen.findByRole('heading', { name: 'Shirt' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hat' })).not.toBeInTheDocument();
  });

  test('shows empty state when no products are in stock', async () => {
    mockFetchProducts.mockResolvedValue([]);

    renderProductCatalog();

    expect(await screen.findByText(/no products in stock/i)).toBeInTheDocument();
  });

  test('shows error when products fetch fails', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Products request failed: 502'));

    renderProductCatalog();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Products request failed: 502'
    );
  });
});
