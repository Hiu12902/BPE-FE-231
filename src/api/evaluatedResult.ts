import Client from '@/api/client';
import { EvaluationResult } from '@/interfaces/evaluatedResult';

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

  public compare(comparePayload: string): Promise<any> {
    return Client.post(`/evaluate/compare`, comparePayload);
  }
}

export default EvaluatedResultApi.instance;
