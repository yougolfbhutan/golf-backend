import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import GetCarrysetCaddieRepository, {
  GolfSetFilters,
} from "../../../model/customer/get-carryset-caddie/get-carryset-caddie.repository";
import { FormateData } from "../../../utils/validation/validation";

class GetCarrysetCaddieService {
  repository: GetCarrysetCaddieRepository;
  constructor() {
    this.repository = new GetCarrysetCaddieRepository();
  }

  async getGolfSets(filters: GolfSetFilters = {}) {
    try {
      const golfSets = await this.repository.getGolfSets(filters);
      return FormateData({ golfSets });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
}

export default GetCarrysetCaddieService;