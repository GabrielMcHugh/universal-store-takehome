import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, loadingAtom, loadProductsAtom, productsAtom } from "../atoms/productAtoms";
import { useEffect } from "react";


export function useProducts() {
    const products = useAtomValue(productsAtom)
    const loading = useAtomValue(loadingAtom);
    const error = useAtomValue(errorAtom);
    const loadProducts = useSetAtom(loadProductsAtom);

    useEffect(() => {
        loadProducts();
    }, [loadProducts])

    return { products, loading, error, refect: () => loadProducts() };
}