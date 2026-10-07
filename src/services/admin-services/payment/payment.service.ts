import type { GetAttributes } from "../../../interface/getattributesinterface";
import type { PaymentAttributes } from "../../../interface/paymentt/payment.interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import PaymentRepository from "../../../model/admin-repository/payment-repository/payment.repository";
import { FormateData } from "../../../utils/validation/validation";

class PaymentService {
  repository: PaymentRepository;
  constructor() {
    this.repository = new PaymentRepository();
  }
  async createPayment(userInputs: PaymentAttributes) {
    const {
      BookingId,
      paymentAmount,
      paymentDate,
      PaymentMethod,
      journalNumber,
      referenceNumber,
    } = userInputs;
    // console.log("Inputs", userInputs);
    try {
      const payment = await this.repository.createPayment({
        BookingId,
        paymentAmount,
        paymentDate,
        PaymentMethod,
        journalNumber,
        referenceNumber,
      });
      return FormateData({
        status: 200,
        data: payment,
        message: "success message",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  async getPayment({ page, limit }: GetAttributes) {
    try {
      const { paymentDetails, total } = await this.repository.getPayment({
        page,
        limit,
      });
      return FormateData({
        status: 200,
        data: {
          paymentDetails,
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        },
        message: "successfully fetched Payment data",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  //   async deletePaymentService(id: number) {
  //     console.log("deleteCaddieService", id);
  //     try {
  //       const existingCustomer = await this.repository.deleteCaddie(id);
  //       return FormateData({ existingCustomer });
  //     } catch (error: unknown) {
  //       throw errorHandler(error);
  //     }
  //   }
  //   async updateCaddieService(id: number, updateData: Partial<CaddieAttributes>) {
  //     console.log("updateCaddieService", id, updateData);
  //     try {
  //       const existingCustomer = await this.repository.updateCaddie(
  //         id,
  //         updateData,
  //       );
  //       return FormateData({ existingCustomer });
  //     } catch (error: unknown) {
  //       throw errorHandler(error);
  //     }
  //   }
  //   async getCaddieService() {
  //     try {
  //       const caddies = await this.repository.getCaddies();
  //       return FormateData({ caddies });
  //     } catch (error: unknown) {
  //       throw errorHandler(error);
  //     }
  //   }
}

export default PaymentService;
