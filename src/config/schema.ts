import { Schema } from "firebase/vertexai";

export const PRODUCT_SCHEMA = Schema.object({
    properties: {
        name: Schema.string({
            description: "The name or model of the product.",
        }),
        brand: Schema.string({
            description: "The brand of the product.",
        }),
        price: Schema.number({
            description: "The price of the product. at the time it was released.",
        }),
        currency: Schema.string({
            description: "The currency of the price.",
        }),
        company: Schema.string({
            description: "The company that manufactured the product.",
        }),
        year: Schema.number({
            description: "The year the product was released.",
        }),
        size: Schema.string({
            description: "The size of the product. Add dimensions if available.",
        }),
        material: Schema.string({
            description: "The material used in the product. ",
        }),
        description: Schema.string({
            description: "A description of the product.",
        }),

        website: Schema.string({
            description: "The website of the product or the company.",
        }),
    },
});