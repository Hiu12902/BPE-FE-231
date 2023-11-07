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

  public searchUsers(searchQuery: string, workspaceId?: number): Promise<any> {
    return Client.get(`/user/search`, {
      params: { s: searchQuery, workspaceId: workspaceId },
    });
  }

  public changePassword(newPassword: string): Promise<any> {
    return Client.put(`/user/password`, { newPassword: newPassword });
  }

  public resetPassword(email: string): Promise<any> {
    return Client.post(`/user/reset`, { email: email });
  }
}

export default UserApi.instance;
