// recommendation.service.js

const getRecommendations = (formData = { selectedPreferences: [], selectedFeatures: [] }, products) => {
  const filteredProducts = filterProductsByPreferences(products, formData.selectedPreferences);

  const scoredProducts = filteredProducts.map((product) => ({
    ...product,
    score: calculateProductScore(product, formData),
  }));

  const sortedProducts = sortProductsByScore(scoredProducts);

  if (formData.selectedRecommendationType === 'SingleProduct') {
    const single = getSingleProduct(sortedProducts);
    return single ? [single] : [];
  } else {
    return sortedProducts;
  }
};

const filterProductsByPreferences = (products, selectedPreferences) => {
  if (!selectedPreferences || selectedPreferences.length === 0) return products;

  return products.filter((product) =>
    product.preferences.some((preference) => selectedPreferences.includes(preference))
  );
};

const calculateProductScore = (product, formData) => {
  let score = 0;
  const selectedPreferences = formData.selectedPreferences || [];
  const selectedFeatures = formData.selectedFeatures || [];

  selectedPreferences.forEach((preference) => {
    if (product.preferences.includes(preference)) score += 1;
  });

  selectedFeatures.forEach((feature) => {
    if (product.features.includes(feature)) score += 1;
  });

  return score;
};

const sortProductsByScore = (products) => {
  return [...products].sort((productA, productB) => productB.score - productA.score);
};

const getSingleProduct = (sortedProducts) => {
  if (!sortedProducts || sortedProducts.length === 0) return null;
  return sortedProducts[sortedProducts.length - 1];
};

export default { getRecommendations };
