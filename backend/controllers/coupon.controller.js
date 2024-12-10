import { fetchUserCoupon, validateUserCoupon, createTestCouponService } from "../services/coupon.service.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await fetchUserCoupon(req.user._id);
    res.json(coupon || null);
  } catch (error) {
    console.error("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    try {
      const coupon = await validateUserCoupon(code, req.user._id);
      res.json({ message: "Coupon is valid", ...coupon });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } catch (error) {
    console.error("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const createTestCoupon = async (req, res) => {
    try {
        const { code, discountPercentage } = req.body;
        
        const coupon = await createTestCouponService({ 
            code, 
            discountPercentage, 
            userId: req.user._id 
        });

        console.log('Created test coupon:', coupon);
        res.status(201).json(coupon);
    } catch (error) {
        console.log("Error creating test coupon:", error.message);
        res.status(500).json({ message: "Error creating coupon" });
    }
};