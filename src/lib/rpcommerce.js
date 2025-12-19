const baseURL =  `${process.env.RED_PANDA_COMMERCE_API_URL}/api/public/store/${process.env.RED_PANDA_COMMERCE_STORE_ID}`;

const RPCommerce = {
    getCategoryByURL: async (url, locale, includeSubCategories = true, level = 2) => {
        const response = await fetch(`${baseURL}/categories/categoryByUrl?url=${url}&includeSubCategories=${includeSubCategories}&locale=${locale}&level=${level}`, {
            headers: {
                'authorization': process.env.RED_PANDA_COMMERCE_STORE_TOKEN
            }
        });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.category;
    },

    getProductsByCategory: async (categoryId, locale) => {
        const response = await fetch(`${baseURL}/products?includeTags=true&includeCategories=true&categories=${categoryId}&includeVariants=true&locale=${locale}&includeMedia=true&includeAttributes=true`, {
            headers: {
                'authorization': process.env.RED_PANDA_COMMERCE_STORE_TOKEN
            }
        });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.products;
    },

    getCategoryFilters: async (categoryId, locale) => {
        const response = await fetch(`${baseURL}/filters/categories/${categoryId}?locale=${locale}`, {
            headers: {
                'authorization': process.env.RED_PANDA_COMMERCE_STORE_TOKEN
            }
        });
        if (!response.ok) {
            return null;
        }
        return response.json();
    }
};

export default RPCommerce;