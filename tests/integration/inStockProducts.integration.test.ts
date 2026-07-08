const CATALOG_URL = process.env.CATALOG_URL ?? 'http://localhost:3000';
const INVENTORY_URL = process.env.INVENTORY_URL ?? 'http://localhost:4000';

type CatalogItem = {
    sku: string;
    title: string;
    price: number;
    image: string;
}

type InventoryItem = {
    sku: string;
    quantity: number;
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${url}`);
    }
    return response.json() as Promise<T>;
}

//Same function as product-landing-page/service
//Joins quanitity to catalog item
function getInStockProducts(
    catalog: CatalogItem[],
    inventory: InventoryItem[]
) {
    const quantityBySku = new Map(
        inventory.map((item) => [item.sku, item.quantity])
    );
    return catalog.flatMap((item) => {
        const quantity = quantityBySku.get(item.sku);
        if (quantity === undefined || quantity <= 0) return [];
        return [{ ...item, quantity }];
    });
}

describe('cross-service: catalog + inventory', () => {
    test('live APIs return mergable in-stock products', async () => {
        const [catalog, inventory] = await Promise.all([
            fetchJson<CatalogItem[]>(`${CATALOG_URL}/catalog`),
            fetchJson<InventoryItem[]>(`${INVENTORY_URL}/inventory`)
        ])

        //Sanity check: both services returning seeded data
        //Assuming a test dataset, not production
        expect(catalog.length).toBeGreaterThanOrEqual(4);
        expect(inventory.length).toBeGreaterThanOrEqual(4);

        const inStock = getInStockProducts(catalog, inventory);

        //From seeds, one of them has quantity 0
        expect(inStock).toHaveLength(3);
        //continuing on that
        const skus = inStock.map((p) => p.sku)
        expect(skus).toEqual(expect.arrayContaining(['111111', '222222', '333333']));
        expect(skus).not.toContain('444444');

        const pen = inStock.find((p) => p.sku === '111111');
        expect(pen).toMatchObject({
            title: 'Pen',
            quantity: 3,
            price: 3,
        });

        //“We don’t stock SKUs that aren’t merchandised in catalog.”
        test('every inventory sku exists in catalog', async () => {
            const [catalog, inventory] = await Promise.all([
                fetchJson<CatalogItem[]>(`${CATALOG_URL}/catalog`),
                fetchJson<InventoryItem[]>(`${INVENTORY_URL}/inventory`),
            ]);
            const catalogSkus = new Set(catalog.map((item) => item.sku));
            for (const item of inventory) {
                expect(catalogSkus.has(item.sku)).toBe(true);
            }
        });
    })




})