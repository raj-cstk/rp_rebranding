const baseURL =  `${process.env.RED_PANDA_COMMERCE_API_URL}/api/public/store/${process.env.RED_PANDA_COMMERCE_STORE_ID}`;
const headers = {
    'Authorization': process.env.RED_PANDA_COMMERCE_STORE_TOKEN
}

const RPCommerce = {
    getCategoryByURL: async (url, locale, includeSubCategories = true, level = 2) => {
        const response = await fetch(`${baseURL}/categories/categoryByUrl?url=${url}&includeSubCategories=${includeSubCategories}&locale=${locale}&level=${level}&useFallbackLocale=true`, {
            headers: headers
        });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.category;
    },

    getProductsByCategory: async (categoryId, locale) => {
        const response = await fetch(`${baseURL}/products?includeTags=true&includeCategories=true&categories=${categoryId}&includeVariants=true&locale=${locale}&includeMedia=true&includeAttributes=true&useFallbackLocale=true`, {
            headers: headers
        });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.products;
    },

    getCategoryFilters: async (categoryId, locale) => {
        const response = await fetch(`${baseURL}/filters/categories/${categoryId}?locale=${locale}&useFallbackLocale=true`, {
            headers: headers
        });
        if (!response.ok) {
            return null;
        }
        return response.json();
    },

    getProductByUrl: async (id, locale) => {
        const response = await fetch(`${baseURL}/products?url=${id}&locale=${locale}&includeMedia=true&includeVariants=true&includeAttributes=true&includeAttributesMap=true&includeCategories=true&includeTags=true&includeCustomData=true`, {
            headers: headers
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.products;
    }
};

export default RPCommerce;