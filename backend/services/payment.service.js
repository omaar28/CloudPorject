import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSessionService = async (userId, products, couponCode) => {
    if (!Array.isArray(products) || products.length === 0) {
        const err = new Error("Invalid or empty products array");
        err.statusCode = 400;
        throw err;
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
        const amount = Math.round(product.price * 100);
        totalAmount += amount * product.quantity;
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image],
                },
                unit_amount: amount,
            },
            quantity: product.quantity || 1,
        };
    });

    let coupon = null;
    if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode, userId, isActive: true });
        if (coupon) {
            totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
        }
    }

    const stripeCouponId = coupon ? await createStripeCoupon(coupon.discountPercentage) : null;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: stripeCouponId
            ? [
                  {
                      coupon: stripeCouponId,
                  },
              ]
            : [],
        metadata: {
            userId: userId.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(
                products.map((p) => ({
                    id: p._id,
                    quantity: p.quantity,
                    price: p.price,
                }))
            ),
        },
    });

    if (totalAmount >= 200) {
        await createNewCoupon(userId);
    }

    return { sessionId: session.id, totalAmount: totalAmount / 100 };
};

export const checkoutSuccessService = async (sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
        if (session.metadata.couponCode) {
            await Coupon.findOneAndUpdate(
                {
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                },
                {
                    isActive: false,
                }
            );
        }

        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            user: session.metadata.userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: session.amount_total / 100,
            stripeSessionId: sessionId,
        });

        await newOrder.save();

        return {
            success: true,
            message: "Payment successful, order created, and coupon deactivated if used.",
            orderId: newOrder._id,
        };
    } else {
        throw new Error("Payment not successful");
    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon.id;
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId,
    });

    await newCoupon.save();
    return newCoupon;
}
