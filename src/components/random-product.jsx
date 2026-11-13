import { useEffect, useState } from 'react';
import ProductCard from './product-card';

export default function RandomProduct() {
	const [productId, setProductId] = useState(1);
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		async function fetchProduct() {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`https://fakestoreapi.com/products/${productId}`,
					{ signal: controller.signal },
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch product (${response.status})`);
				}

				const data = await response.json();
				setProduct(data);
			} catch (fetchError) {
				if (fetchError.name !== 'AbortError') {
					setError(fetchError.message);
					setProduct(null);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		fetchProduct();

		return () => controller.abort();
	}, [productId]);

	function randomize() {
		setProductId(Math.floor(Math.random() * 20) + 1);
	}

	return (
		<div className="flex flex-col gap-4">
			<button
				type="button"
				onClick={randomize}
				className="w-fit rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
			>
				Randomize product
			</button>

			{loading && <p>Loading product...</p>}
			{error && <p role="alert">Error loading product: {error}</p>}
			{!loading && !error && product && (
				<ProductCard
					title={product.title}
					price={product.price}
					image={product.image}
					description={product.description}
					category={product.category}
					rating={product.rating}
				/>
			)}
		</div>
	);
}
