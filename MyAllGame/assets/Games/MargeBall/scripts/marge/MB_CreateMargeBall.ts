import LoadBundleData from "../../../../Common/CommonScrtips/LoadBundle/LoadBundleData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MB_CreateMargeBall extends cc.Component {

    @property(cc.Prefab)
    ballPrefabs: cc.Prefab[] = [];

    /**所有小球的父结点 */
    ballsParent: cc.Node = null;

    onLoad() {
        this.InitNode();
    }

    InitNode() {
        this.ballsParent = cc.find('Canvas/ballsParent');
    }


    CreateBall(id: number) {
        
    }

}
