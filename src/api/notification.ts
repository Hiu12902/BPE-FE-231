import Client from "@/api/client";

class NotificationApi {
    public static classInstance: NotificationApi;

    static get instance() {
        if (!this.classInstance) {
            this.classInstance = new NotificationApi();
        }

        return this.classInstance;
    }

    public getUserNotification(query?: {
        keyword?: string;
        page?: number;
    }): Promise<any> {
        return Client.get(`/user/notification`, {
            params: {
                ...query,
            },
        });
    }

    public sendInvitationNotification({
        id,
        content,
        workspaceId,
        permission,
    }: {
        id: number;
        content: string;
        workspaceId: number;
        permission: string;
    }): Promise<any> {
        return Client.post(`/user/notification`, {
            userId: id.toString(),
            content: content,
            notificationType: "invitation",
            status: "pending",
            workspaceId: workspaceId.toString(),
            permission: permission,
        });
    }

    public starNotification({
        id,
        status,
    }: {
        id: number;
        status: boolean;
    }): Promise<any> {
        return Client.post(`/user/notification/star`, {
            notificationId: id.toString(),
            isStarred: status,
        });
    }

    public deleteNotification({ idList }: { idList: string[] }): Promise<any> {
        return Client.post(`/user/notification/deletion`, {
            notificationIdList: idList,
        });
    }

    public readNotification({ id }: { id: string }): Promise<any> {
        return Client.post(`/user/notification/read`, {
            notificationId: id,
        });
    }

    public responseInvitation({
        id,
        status,
        workspaceId,
        userId,
        permission,
    }: {
        id: string;
        status: string;
        workspaceId: string;
        userId: string;
        permission: string;
    }): Promise<any> {
        return Client.post(`/user/notification/action`, {
            notificationId: id,
            status: status,
            workspaceId: workspaceId,
            userId: userId,
            permission: permission,
        });
    }
}

export default NotificationApi.instance;
