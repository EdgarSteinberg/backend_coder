import { fakerEN as faker } from '@faker-js/faker';

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()]
    };
};

export const getMockedProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(generateProduct());
    }
    return products;
};
