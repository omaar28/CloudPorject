import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getCoupon, 
    validateCoupon, 
    createTestCoupon 
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/create-test", protectRoute, createTestCoupon);

export default router;










/* dah el adeeeeeeeem
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

export default router;*/