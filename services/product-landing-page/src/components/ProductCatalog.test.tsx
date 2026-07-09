import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { ProductCatalog } from './ProductCatalog';
import { fetchCatalog } from '../api/catalogClient';
import { fetchInventory } from '../api/inventoryClient';
import { catalogItems, inventoryItems } from './test/fixtures';

//Component test (react/jotai/hook)

jest.mock('../api/catalogClient');
jest.mock('../api/inventoryClient');

const mockFetchCatalog = fetchCatalog as jest.MockedFunction<typeof fetchCatalog>;
const mockFetchInventory = fetchInventory as jest.MockedFunction<typeof fetchInventory>;

function renderProductCatalog() {
    //To prevent state leaks (store isolation)
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
        mockFetchCatalog.mockReturnValue(new Promise(() => { }));   // never resolves
        mockFetchInventory.mockReturnValue(new Promise(() => { }));

        renderProductCatalog();

        expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    });

    test('renders in-stock products only', async () => {
        mockFetchCatalog.mockResolvedValue(catalogItems);
        mockFetchInventory.mockResolvedValue(inventoryItems);

        renderProductCatalog();

        expect(await screen.findByRole('heading', { name: 'Shirt' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Hat' })).not.toBeInTheDocument();
    });

    test('shows empty state when no products are in stock', async () => {
        mockFetchCatalog.mockResolvedValue(catalogItems);
        mockFetchInventory.mockResolvedValue([
            { sku: '111111', quantity: 0 },
            { sku: '222222', quantity: 0 },
        ]);

        renderProductCatalog();

        expect(await screen.findByText(/no products in stock/i)).toBeInTheDocument();
    });

    test('shows error when catalog fetch fails', async () => {
        mockFetchCatalog.mockRejectedValue(new Error('Catalog request failed: 500'));
        mockFetchInventory.mockResolvedValue(inventoryItems);

        renderProductCatalog();

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Catalog request failed: 500'
        );
    });
});