import Client from '@/api/client';
import { EvaluationResult } from '@/interfaces/evaluatedResult';
import { CompareResult } from '@/redux/slices/comparing';

class EvaluatedResultApi {
  public static classInstance: EvaluatedResultApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new EvaluatedResultApi();
    }

    return this.classInstance;
  }

  public evaluate(evalutePayload: string): Promise<EvaluationResult[]> {
    return Client.post(`/evaluate`, evalutePayload);
  }

  public compare(comparePayload: string): Promise<CompareResult> {
    return Client.post(`/evaluate/compare`, comparePayload);
  }

  public getSellingAsIs(): Promise<EvaluationResult[]> {
    return Client.get('/evaluate/selling_as_is');
  }

  public getSellingToBe(): Promise<EvaluationResult[]> {
    return Client.get('/evaluate/selling_to_be');
  }

  public getReschedulingAsIs(): Promise<EvaluationResult[]> {
    return Client.get('/evaluate/rescheduling_as_is');
  }

  public getReschedulingTobe(): Promise<EvaluationResult[]> {
    return Client.get('/evaluate/rescheduling_to_be');
  }
}

export default EvaluatedResultApi.instance;
