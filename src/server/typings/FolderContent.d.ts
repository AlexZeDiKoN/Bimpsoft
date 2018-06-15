declare module server {
    interface FolderContents {
        params: Params;
        entities: server.Document[];
    }

    interface Params {
        currentContainer: CurrentContainer;
        pathTo: PathInfo[];
    }

    interface CurrentContainer {
        id?: number;
        name: string;
        parentId?: number;
        type: string;
        isCanAddMap: boolean;
        isCanAddLayer: boolean;
        isCanAddFile: boolean;
        isCanAddFolder: boolean;
    }

    interface PathInfo {
        orderNum: number;
        tag: string;
        folderID: number;
        name: string;
    }
}
