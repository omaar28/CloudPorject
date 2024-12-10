import { createCheckoutSessionService, checkoutSuccessService } from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        const userId = req.user._id;

        const { sessionId, totalAmount } = await createCheckoutSessionService(userId, products, couponCode);

        res.status(200).json({ id: sessionId, totalAmount });
    } catch (error) {
        console.error("Error processing checkout:", error);
        const status = error.statusCode || 500;
        res.status(status).json({ message: "Error processing checkout", error: error.message });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const result = await checkoutSuccessService(sessionId);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};
