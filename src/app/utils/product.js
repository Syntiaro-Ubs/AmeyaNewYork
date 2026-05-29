export function getProductIdentifiers(productOrId) {
  if (productOrId === null || productOrId === undefined) {
    return [];
  }

  if (typeof productOrId === 'object') {
    return [...new Set([productOrId.product_id, productOrId.id].filter(value => value !== null && value !== undefined && value !== '').map(value => String(value)))];
  }

  return [String(productOrId)];
}

export function getProductKey(productOrId) {
  return getProductIdentifiers(productOrId)[0] ?? '';
}

export function getProductRouteId(productOrId) {
  return getProductKey(productOrId);
}

export function matchesProductIdentifier(product, productOrId) {
  const productIds = getProductIdentifiers(product);
  const candidateIds = getProductIdentifiers(productOrId);

  if (productIds.length === 0 || candidateIds.length === 0) {
    return false;
  }

  return candidateIds.some(id => productIds.includes(id));
}

export function resolveProductByIdentifier(products, productOrId) {
  return products.find(product => matchesProductIdentifier(product, productOrId)) ?? null;
}
