import Client from '@/api/client';
import { IUser, IUserSignin, IUserSignup } from '@/interfaces/user';

class UserApi {
  public static classInstance: UserApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new UserApi();
    }

    return this.classInstance;
  }

  public signUp(user: IUserSignup): Promise<any> {
    return Client.post(`/user/signup`, user);
  }

  public signIn(user: IUserSignin): Promise<any> {
    return Client.post(`/user/signin`, user);
  }

  public getMe(): Promise<any> {
    return Client.get(`/user`);
  }

  public resendVerificationEmail(payload: { email: string }): Promise<any> {
    return Client.post(`/user/resend`, payload);
  }
}

export default UserApi.instance;
