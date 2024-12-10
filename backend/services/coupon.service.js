import Coupon from "../models/coupon.model.js";

export const fetchUserCoupon = async (userId) => {
  return await Coupon.findOne({ userId: userId, isActive: true });
};

export const validateUserCoupon = async (code, userId) => {
  const coupon = await Coupon.findOne({ code: code, userId: userId, isActive: true });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new Error("Coupon expired");
  }

  return {
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  };
};

export const createTestCouponService = async ({ code, discountPercentage, userId }) => {
  const coupon = await Coupon.create({
      code,
      discountPercentage,
      expirationDate: new Date("2024-12-31"),
      isActive: true,
      userId: userId
  });
  return coupon;
};