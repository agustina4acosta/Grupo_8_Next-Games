const { Op } = require("sequelize")
const db = require('../database/models')
module.exports = mtd = {
    getOrder: async ({ userId }) => {
        if (!userId) {
            throw {
                ok: false,
                message: "Debes ingresar el userId"
            }
        }
        const [order] = await db.Order.findOrCreate({
            where: {
                [Op.and]: [
                    {
                        userId,
                    },
                    {
                        status: "pending",
                    }
                ],
            },
            defaults: {
                userId,
            },
            include: [
                {
                    association: "cart",
                    through: {
                        attributes: ["quantity", "cuotas"],
                    }
                },
            ],
        });
        return order;
    },
    createProductCart: async ({ userId, productId }) => {
        if (!userId || !productId) {
            throw {
                ok: false,
                message: "Debes ingresar el userId y productId"
            };
        }
        const order = await mtd.getOrder({ userId });
        await mtd.getCart({ orderId: order.id, productId });
        const orderReload = await order.reload({ include: { all: true } });
        order.total = mtd.calcTotal(orderReload);
        await order.save();
    },
    removeProductFromCart: async ({ userId, productId }) => {
        if (!userId || !productId) {
            throw {
                ok: false,
                message: "Debes ingresar el userId y productId",
            };
        }
        const order = await mtd.getOrder({ userId });
        await mtd.removeCart({ orderId: order.id, productId });
        const orderReload = await order.reload({ include: { all: true } });
        order.total = mtd.calcTotal(orderReload);
        await order.save();
    },
    moreOrLessQuantityFromProduct: async ({ userId, productId, action = "more" }) => {
        if (!userId || !productId) {
            throw {
                ok: false,
                message: "Debes ingresar el userId y productId",
            };
        }
        const order = await mtd.getOrder({ userId });

        const [cart, isCreated] = await mtd.getCart({

            orderId: order.id,
            productId,
        });


        if (!isCreated) {
            if (action === "more") {
                cart.quantity++;
            } else {
                if (cart.quantity > 1) {
                    cart.quantity--;
                }
            }
            await cart.save();
        }

        const orderReload = await order.reload({ include: { all: true } })
        order.total = mtd.calcTotal(orderReload);
        await order.save();

        return order;
    },
    saveQuantityFromProduct: async ({ userId, productId, quantity }) => {
        if (!userId || !productId || !quantity) {
            throw {
                ok: false,
                message: "Debes ingresar el userId, productId y quantity",
            };
        }
        const order = await mtd.getOrder({ userId });

        const [cart, isCreated] = await mtd.getCart({

            orderId: order.id,
            productId,
        });

        cart.quantity = +quantity
        await cart.save(); // si ya existe
        return isCreated
    },
    clearAllProductFromCart: async ({ userId }) => {
        if (!userId) {
            throw {
                ok: false,
                message: "Debes ingresar el userId",
            };
        }
        const order = await mtd.getOrder({ userId })
        await db.Cart.destroy({
            where: { orderId: order.id },
        });

        const orderReload = await order.reload({ include: { all: true } });
        order.total = mtd.calcTotal(orderReload);
        await order.save();
    },
    modifyStatusFromOrder: async ({ userId, status }) => {
        if (!userId || !status) {
            throw {
                ok: false,
                message: "Debes ingresar el userId y el status"
            }
        }
        const order = await mtd.getOrder({ userId });
        order.status = status
        return order.save()
    },
    removeCart: ({ orderId, productId }) => {
        return db.Cart.destroy({
            where: {
                [Op.and]: [
                    {
                        orderId,
                    },
                    {
                        productId,
                    },
                ],
            },
        });
    },
    getCart: ({ orderId, productId }) => {
        return db.Cart.findOrCreate({
            where: {
                [Op.and]: [
                    {
                        orderId,
                    },
                    {
                        productId,
                    },
                ]
            },
            defaults: {
                orderId,
                productId,
            }
        });
    },
    calcTotal: ({ cart }) => {
        return cart.reduce((acum, { price, Cart, discount }) => {
            const priceCalc = discount ? price - (price * discount) / 100 : price;
            acum += priceCalc * Cart.quantity;
            return acum;
        }, 0);
    },
    saveCuotas: async (productId, cuotas) => {
        try {
            const cart = await db.Cart.findOne({ where: { productId } });

            if (!cart) {
                await db.Cart.create({ productId, cuotas });
            } else {
                cart.cuotas = cuotas;
                await cart.save();
            }

            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

};
